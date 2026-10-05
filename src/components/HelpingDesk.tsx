import React, { useEffect, useRef } from 'react';
import { Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import threadArtImage from '../assets/images/thread-art.png';

/**
 * ============================================================================
 * TWEAKABLE ANIMATION TIMING & VALUES
 * ============================================================================
 * Preserves the exact SVG artwork, path timing, and easing from thread-scroll.html:
 * - girlFade: [0.00, 0.10]
 * - threadToHeart (p0 + p1): [0.10, 0.55]
 * - sparkles: 0.55 (when heart completes)
 * - boyFade: [0.55, 0.68]
 * - threadToBoy (p2): [0.68, 0.95]
 * - easingSpeed: 0.16 (Fast, snappy, responsive scroll scrubbing)
 */
export const HELP_DESK_TWEAKS = {
  ranges: {
    girlFade: [0.00, 0.10],
    threadToHeart: [0.10, 0.55],
    sparkles: 0.55,
    boyFade: [0.55, 0.68],
    threadToBoy: [0.68, 0.95],
  },
  easingSpeed: 0.16,
  cardBgOpacity: 0.24,
  cardBlur: '4px',
  threadWidth: 7.5,
  threadColor: '#bf080a',
};

export const HelpingDesk: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p0Ref = useRef<SVGPathElement>(null);
  const p1Ref = useRef<SVGPathElement>(null);
  const p2Ref = useRef<SVGPathElement>(null);
  const spRef = useRef<SVGGElement>(null);
  const womanRef = useRef<SVGUseElement>(null);
  const manRef = useRef<SVGUseElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const p0 = p0Ref.current;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const sp = spRef.current;
    const woman = womanRef.current;
    const man = manRef.current;

    if (!container || !p0 || !p1 || !p2 || !sp || !woman || !man) return;

    const paths = [p0, p1, p2];
    const lengths = paths.map((p) => p.getTotalLength());

    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lengths[i]}`;
      p.style.strokeDashoffset = `${lengths[i]}`;
      p.style.opacity = '0';
    });

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

    const setPathProgress = (index: number, f: number) => {
      paths[index].style.strokeDashoffset = `${lengths[index] * (1 - f)}`;
      paths[index].style.opacity = f > 0.002 ? '1' : '0';
    };

    const getScrollProgress = () => {
      const phoneViewport = container.closest('[data-phone-scroll="true"]') as HTMLElement | null;

      let viewportHeight = window.innerHeight;
      let containerTop = 0;
      const containerHeight = container.offsetHeight;

      if (phoneViewport) {
        const vRect = phoneViewport.getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        viewportHeight = vRect.height;
        containerTop = cRect.top - vRect.top;
      } else {
        const cRect = container.getBoundingClientRect();
        containerTop = cRect.top;
      }

      // Fast, snappy scrubbing as cards pass through viewport
      const startOffset = viewportHeight * 0.75;
      const endOffset = viewportHeight * 0.25;
      const travelDist = containerHeight + startOffset - endOffset;

      if (travelDist <= 0) return 0;
      const raw = (startOffset - containerTop) / travelDist;
      return clamp(raw);
    };

    const render = (p: number) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Woman holding cup (fades in from 0 to 0.10)
      const girlOpacity = reducedMotion ? (p >= 0.01 ? 1 : 0) : seg(p, 0, 0.10);
      woman.setAttribute('opacity', String(girlOpacity));

      // Thread: Girl's cup down to Heart (continuous through p0 and p1)
      const a = seg(p, 0.10, 0.55);
      const d = a * (lengths[0] + lengths[1]);
      setPathProgress(0, clamp(d / lengths[0]));
      setPathProgress(1, clamp((d - lengths[0]) / lengths[1]));

      // Sparkles pop on when heart is fully closed
      if (a >= 0.999 && p <= 0.98) {
        sp.classList.add('on');
      } else {
        sp.classList.remove('on');
      }

      // 2. Man holding cup (fades in from 0.55 to 0.68)
      const boyOpacity = reducedMotion ? (p >= 0.55 ? 1 : 0) : seg(p, 0.55, 0.68);
      man.setAttribute('opacity', String(boyOpacity));

      // 3. Thread: from heart down into boy's cup (0.68 to 0.95)
      setPathProgress(2, seg(p, 0.68, 0.95));
    };

    let curProgress = 0;
    let animId: number;

    const tick = () => {
      const target = getScrollProgress();
      curProgress += (target - curProgress) * HELP_DESK_TWEAKS.easingSpeed;
      if (Math.abs(target - curProgress) < 0.0003) {
        curProgress = target;
      }
      render(curProgress);
      animId = requestAnimationFrame(tick);
    };

    render(0);
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="helpdesk" className="pt-12 pb-20 sm:pt-14 sm:pb-24 px-3 sm:px-4 w-full max-w-full box-border relative overflow-x-hidden">
      {/* Inline styles for the thread animation elements & text halos */}
      <style>{`
        .helpdesk-t {
          fill: none;
          stroke: ${HELP_DESK_TWEAKS.threadColor};
          stroke-width: ${HELP_DESK_TWEAKS.threadWidth}px;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: opacity 0.15s ease-out;
        }
        .helpdesk-sp line {
          stroke: ${HELP_DESK_TWEAKS.threadColor};
          stroke-width: 7px;
          stroke-linecap: round;
        }
        .helpdesk-sp {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          transition: opacity 0.25s ease;
        }
        .helpdesk-sp.on {
          opacity: 1;
        }
        .helpdesk-card-text {
          text-shadow: 0 1px 2px #fff, 0 0 8px rgba(255, 255, 255, 0.95), 0 0 16px rgba(255, 255, 255, 0.9);
        }
        @media (prefers-reduced-motion: reduce) {
          .helpdesk-sp {
            transition: none;
          }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-xl mx-auto box-border">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center w-full max-w-xl mx-auto mb-8 sm:mb-10 px-4 box-border">
            <span className="text-[11px] sm:text-xs font-sans tracking-[0.26em] text-[#8c601d] uppercase font-bold block mb-1">
              WE ARE HERE FOR YOU
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl text-[#140F0A] font-bold leading-tight break-words">
              Helping Desk &amp; Guest Concierge
            </h2>
            <p className="font-cursive text-xl sm:text-2xl text-[#7A4B00] mt-1.5 font-normal tracking-wide break-words">
              Here for your convenience &amp; peace of mind
            </p>
          </div>
        </RevealOnScroll>

        {/* ── UNIFIED CONTAINER: 3 Stacked Transparent Cards with Background Thread Animation ── */}
        <div
          ref={containerRef}
          id="helpdesk-cards-container"
          className="relative w-full max-w-[440px] sm:max-w-[460px] mx-auto flex flex-col gap-5 sm:gap-6 box-border"
        >
          {/* ============================================================
               BACKGROUND LAYER: SCROLL-DRIVEN THREAD ARTWORK (VISIBLE UNDER CARDS)
               ============================================================ */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible flex items-center justify-center"
            style={{ zIndex: 0 }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 941 1672"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full scale-[1.08] sm:scale-[1.12]"
              style={{ overflow: 'visible' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <image
                  id="helpdesk-im"
                  href={threadArtImage}
                  xlinkHref={threadArtImage}
                  width="941"
                  height="1672"
                />
                <clipPath id="helpdesk-cw">
                  <rect x="0" y="0" width="941" height="700" />
                </clipPath>
                <clipPath id="helpdesk-cm">
                  <rect x="0" y="700" width="941" height="972" />
                </clipPath>
              </defs>

              {/* Step 1: Girl holding cup (fades in fast at top) */}
              <use
                ref={womanRef}
                href="#helpdesk-im"
                clipPath="url(#helpdesk-cw)"
                opacity="0"
              />

              {/* Step 3: Boy holding cup (fades in fast at bottom) */}
              <use
                ref={manRef}
                href="#helpdesk-im"
                clipPath="url(#helpdesk-cm)"
                opacity="0"
              />

              {/* Continuous Thread Path 0: Girl's cup down toward heart */}
              <path
                ref={p0Ref}
                className="helpdesk-t"
                d="M547.0,211.0C550.2,214.5 561.3,226.8 566.0,232.0C570.7,237.2 572.2,238.7 575.0,242.0C577.8,245.3 580.4,248.7 583.0,252.0C585.6,255.3 588.1,258.7 590.5,262.0C592.9,265.3 595.3,268.7 597.5,272.0C599.7,275.3 601.5,278.7 603.5,282.0C605.5,285.3 607.6,288.7 609.5,292.0C611.4,295.3 613.2,298.7 615.0,302.0C616.8,305.3 618.3,308.7 620.0,312.0C621.7,315.3 623.5,318.7 625.0,322.0C626.5,325.3 627.7,328.7 629.0,332.0C630.3,335.3 631.8,338.7 633.0,342.0C634.2,345.3 635.0,348.7 636.0,352.0C637.0,355.3 638.0,358.7 639.0,362.0C640.0,365.3 641.2,368.7 642.0,372.0C642.8,375.3 643.5,378.7 644.0,382.0C644.5,385.3 644.7,388.7 645.0,392.0C645.3,395.3 645.7,398.7 646.0,402.0C646.3,405.3 646.8,408.7 647.0,412.0C647.2,415.3 647.1,418.7 647.0,422.0C646.9,425.3 646.8,428.7 646.5,432.0C646.2,435.3 645.6,438.7 645.0,442.0C644.4,445.3 643.7,448.7 643.0,452.0C642.3,455.3 641.8,458.7 641.0,462.0C640.2,465.3 639.2,468.7 638.0,472.0C636.8,475.3 635.4,478.7 634.0,482.0C632.6,485.3 631.2,488.7 629.5,492.0C627.8,495.3 625.7,498.7 623.5,502.0C621.3,505.3 619.0,508.7 616.5,512.0C614.0,515.3 611.3,518.7 608.5,522.0C605.7,525.3 602.7,528.7 599.5,532.0C596.3,535.3 593.1,538.7 589.5,542.0C585.9,545.3 582.0,548.7 578.0,552.0C574.0,555.3 569.8,558.7 565.5,562.0C561.2,565.3 557.2,568.7 552.5,572.0C547.8,575.3 542.5,578.7 537.5,582.0C532.5,585.3 527.6,588.7 522.5,592.0C517.4,595.3 512.0,598.7 507.0,602.0C502.0,605.3 497.2,608.7 492.5,612.0C487.8,615.3 482.9,618.7 478.5,622.0C474.1,625.3 469.8,628.7 466.0,632.0C462.2,635.3 458.8,638.7 455.5,642.0C452.2,645.3 448.8,648.7 446.0,652.0C443.2,655.3 440.7,658.7 438.5,662.0C436.3,665.3 434.7,668.7 433.0,672.0C431.3,675.3 429.7,678.7 428.5,682.0C427.3,685.3 426.8,688.7 426.0,692.0C425.2,695.3 424.3,698.7 424.0,702.0C423.7,705.3 423.8,708.7 424.0,712.0C424.2,715.3 424.8,718.7 425.5,722.0C426.2,725.3 427.0,728.7 428.0,732.0C429.0,735.3 430.1,738.7 431.5,742.0C432.9,745.3 434.8,748.7 436.5,752.0C438.2,755.3 441.1,760.3 442.0,762.0"
              />

              {/* Step 2: Heart path (drawn in Card 2) */}
              <path
                ref={p1Ref}
                className="helpdesk-t"
                d="M442.5,785.8C444.0,786.0 448.4,786.2 451.2,786.9C454.1,787.6 457.1,788.8 459.7,790.1C462.4,791.4 464.9,793.0 467.2,794.8C469.5,796.6 471.6,798.8 473.4,800.7C475.2,802.6 476.5,805.3 477.9,806.1C479.3,807.0 480.4,806.7 481.7,805.6C482.9,804.5 483.8,802.4 485.5,799.7C487.1,797.0 489.1,792.5 491.4,789.5C493.7,786.5 496.4,783.8 499.2,781.6C502.0,779.3 505.2,777.4 508.2,776.2C511.2,774.9 514.4,774.3 517.4,773.9C520.5,773.6 523.7,773.6 526.7,774.1C529.6,774.6 532.5,775.6 535.2,776.9C537.8,778.1 540.4,779.7 542.5,781.6C544.6,783.5 546.4,785.8 547.9,788.3C549.4,790.8 550.6,793.5 551.3,796.4C552.0,799.2 552.1,802.3 552.1,805.2C552.1,808.2 552.1,811.1 551.6,814.0C551.1,816.9 550.0,819.8 549.1,822.5C548.1,825.2 547.0,827.7 545.8,830.1C544.6,832.4 543.3,834.7 541.9,836.8C540.5,839.0 539.0,841.0 537.7,842.9C536.4,844.8 535.4,846.5 534.2,848.1C532.9,849.8 531.5,851.2 530.3,852.7C529.0,854.1 528.0,855.6 526.8,856.9C525.6,858.3 524.3,859.5 523.2,860.8C522.0,862.0 521.1,863.4 520.0,864.6C519.0,865.8 517.8,866.9 516.7,868.0C515.6,869.1 514.4,870.1 513.3,871.3C512.2,872.5 511.0,873.8 509.8,875.0C508.6,876.2 507.4,877.3 506.2,878.5C504.9,879.6 503.7,880.7 502.4,881.9C501.1,883.1 499.7,884.4 498.3,885.7C496.9,886.9 495.6,888.3 494.0,889.3C492.3,890.2 490.3,891.3 488.5,891.3C486.6,891.4 484.6,890.5 482.8,889.7C481.0,889.0 479.5,888.0 477.9,887.0C476.3,886.1 474.6,885.0 473.1,884.0C471.6,883.1 470.2,882.0 468.8,881.1C467.4,880.2 466.1,879.2 464.8,878.4C463.5,877.6 462.2,876.9 460.9,876.1C459.6,875.3 458.3,874.4 457.0,873.6C455.7,872.8 454.5,872.1 453.2,871.2C452.0,870.4 450.7,869.5 449.3,868.6C447.9,867.7 446.3,866.9 444.9,865.9C443.4,864.9 442.1,863.8 440.6,862.7C439.2,861.5 437.7,860.4 436.2,859.2C434.7,857.9 433.2,856.7 431.6,855.3C430.1,853.9 428.6,852.3 427.0,850.7C425.4,849.0 423.6,847.4 422.0,845.4C420.4,843.5 418.9,841.3 417.6,839.1C416.2,836.8 414.8,834.4 413.8,832.0C412.8,829.5 412.0,827.0 411.5,824.4C411.0,821.7 410.9,819.0 410.9,816.3C411.0,813.6 411.0,810.7 411.7,808.1C412.4,805.6 413.6,803.1 414.9,800.8C416.3,798.5 417.9,796.4 419.9,794.6C421.8,792.7 424.0,790.9 426.4,789.6C428.9,788.4 431.8,787.5 434.4,786.8C437.1,786.2 441.2,786.0 442.5,785.8"
              />

              {/* Step 3: Thread path continuing to boy's cup */}
              <path
                ref={p2Ref}
                className="helpdesk-t"
                d="M490.0,893.0C489.9,893.7 489.0,894.7 489.5,897.0C490.0,899.3 492.6,903.7 493.0,907.0C493.4,910.3 492.8,913.7 492.0,917.0C491.2,920.3 490.1,923.7 488.5,927.0C486.9,930.3 484.8,933.7 482.5,937.0C480.2,940.3 477.8,943.7 475.0,947.0C472.2,950.3 469.1,953.7 466.0,957.0C462.9,960.3 459.8,963.7 456.5,967.0C453.2,970.3 449.8,973.7 446.5,977.0C443.2,980.3 439.7,983.7 436.5,987.0C433.3,990.3 430.5,993.7 427.5,997.0C424.5,1000.3 421.4,1003.7 418.5,1007.0C415.6,1010.3 412.8,1013.7 410.0,1017.0C407.2,1020.3 404.6,1023.7 402.0,1027.0C399.4,1030.3 396.9,1033.7 394.5,1037.0C392.1,1040.3 389.6,1043.7 387.5,1047.0C385.4,1050.3 383.7,1053.7 382.0,1057.0C380.3,1060.3 378.9,1063.7 377.5,1067.0C376.1,1070.3 374.8,1073.7 373.5,1077.0C372.2,1080.3 371.0,1083.7 370.0,1087.0C369.0,1090.3 368.2,1093.7 367.5,1097.0C366.8,1100.3 366.4,1103.7 366.0,1107.0C365.6,1110.3 365.2,1113.7 365.0,1117.0C364.8,1120.3 365.0,1123.7 365.0,1127.0C365.0,1130.3 364.7,1133.7 365.0,1137.0C365.3,1140.3 366.3,1143.7 367.0,1147.0C367.7,1150.3 368.2,1153.7 369.0,1157.0C369.8,1160.3 370.8,1163.7 372.0,1167.0C373.2,1170.3 374.8,1173.7 376.5,1177.0C378.2,1180.3 375.6,1178.8 382.5,1187.0C389.4,1195.2 412.1,1219.5 418.0,1226.0"
              />

              {/* Sparkle lines around the heart */}
              <g ref={spRef} id="helpdesk-sp" className="helpdesk-sp">
                <line x1="360" y1="758" x2="393" y2="780" />
                <line x1="548" y1="713" x2="527" y2="750" />
                <line x1="605" y1="738" x2="570" y2="767" />
              </g>
            </svg>
          </div>

          {/* ============================================================
               CARD 1: ROHAN SHARMA (WEDDING COORDINATOR & GENERAL ENQUIRIES)
               ============================================================ */}
          <div className="relative z-10 w-full rounded-[28px] p-[5px] border border-[#d4af67] bg-[#fefaef]/24 backdrop-blur-[5px] shadow-[0_16px_40px_rgba(92,69,34,0.08),0_3px_10px_rgba(92,69,34,0.04)] transition-all duration-200">
            <div 
              className="border border-[#d4af67]/45 rounded-[23px] p-5 sm:p-6 flex flex-col relative text-left"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 253, 248, 0.40) 0%, rgba(254, 250, 243, 0.20) 100%)' }}
            >
              {/* Person-with-check icon badge */}
              <div className="w-10 h-10 rounded-[10px] border border-[#c5a059]/60 bg-white/90 flex items-center justify-center text-[#634a21] mb-3.5 shadow-2xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>

              {/* Small gold letter-spaced uppercase label */}
              <div 
                className="text-[11px] font-sans font-extrabold tracking-[0.16em] uppercase text-[#734c0f] mb-2 leading-relaxed helpdesk-card-text"
              >
                WEDDING COORDINATOR &amp; GENERAL ENQUIRIES
              </div>

              {/* Serif name */}
              <h2 
                className="font-serif text-[28px] sm:text-[30px] font-bold text-[#140f0a] leading-tight mb-2 tracking-tight helpdesk-card-text"
              >
                Rohan Sharma
              </h2>

              {/* Clock icon + availability line */}
              <div 
                className="flex items-center gap-1.5 mb-2 text-[13.5px] font-semibold text-[#2c2217] helpdesk-card-text"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#734c0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Available 24/7 during wedding week</span>
              </div>

              {/* Phone number */}
              <div 
                className="text-[19px] font-sans font-extrabold text-[#140f0a] tracking-wide mb-4 helpdesk-card-text"
              >
                +91 98765 43210
              </div>

              {/* Thin gold divider */}
              <div className="h-[1px] w-full bg-[#c5a059]/40 mb-4" />

              {/* Action buttons: CALL & WHATSAPP */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+919876543210"
                  id="call-card-1"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#c5a059] bg-[#fffcf5]/95 text-[#16130f] shadow-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c601d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>CALL</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  id="whatsapp-card-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#22c55e]/70 bg-[#f0fdf4]/96 text-[#15803d] shadow-xs hover:bg-[#f0fdf4] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 8 8v.5z" />
                  </svg>
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================
               CARD 2: PRIYA VERMA (GUEST HOSPITALITY & STAY CONCIERGE)
               ============================================================ */}
          <div className="relative z-10 w-full rounded-[28px] p-[5px] border border-[#d4af67] bg-[#fefaef]/24 backdrop-blur-[5px] shadow-[0_16px_40px_rgba(92,69,34,0.08),0_3px_10px_rgba(92,69,34,0.04)] transition-all duration-200">
            <div 
              className="border border-[#d4af67]/45 rounded-[23px] p-5 sm:p-6 flex flex-col relative text-left"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 253, 248, 0.40) 0%, rgba(254, 250, 243, 0.20) 100%)' }}
            >
              {/* Bed icon badge */}
              <div className="w-10 h-10 rounded-[10px] border border-[#c5a059]/60 bg-white/90 flex items-center justify-center text-[#634a21] mb-3.5 shadow-2xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v11M3 13h18v5M21 10v8M7 10h10a2 2 0 0 1 2 2v1H5v-1a2 2 0 0 1 2-2z" />
                </svg>
              </div>

              {/* Small gold letter-spaced uppercase label */}
              <div 
                className="text-[11px] font-sans font-extrabold tracking-[0.16em] uppercase text-[#734c0f] mb-2 leading-relaxed helpdesk-card-text"
              >
                GUEST HOSPITALITY &amp; STAY CONCIERGE
              </div>

              {/* Serif name */}
              <h2 
                className="font-serif text-[28px] sm:text-[30px] font-bold text-[#140f0a] leading-tight mb-2 tracking-tight helpdesk-card-text"
              >
                Priya Verma
              </h2>

              {/* Clock icon + availability line */}
              <div 
                className="flex items-center gap-1.5 mb-2 text-[13.5px] font-semibold text-[#2c2217] helpdesk-card-text"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#734c0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Check-in, rooms &amp; hotel arrangements</span>
              </div>

              {/* Phone number */}
              <div 
                className="text-[19px] font-sans font-extrabold text-[#140f0a] tracking-wide mb-4 helpdesk-card-text"
              >
                +91 98765 43211
              </div>

              {/* Thin gold divider */}
              <div className="h-[1px] w-full bg-[#c5a059]/40 mb-4" />

              {/* Action buttons: CALL & WHATSAPP */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+919876543211"
                  id="call-card-2"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#c5a059] bg-[#fffcf5]/95 text-[#16130f] shadow-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c601d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>CALL</span>
                </a>
                <a
                  href="https://wa.me/919876543211"
                  id="whatsapp-card-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#22c55e]/70 bg-[#f0fdf4]/96 text-[#15803d] shadow-xs hover:bg-[#f0fdf4] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 8 8v.5z" />
                  </svg>
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================
               CARD 3: VIKRAM SINGH (TRAVEL, AIRPORT & LOCAL TRANSFERS DESK)
               ============================================================ */}
          <div className="relative z-10 w-full rounded-[28px] p-[5px] border border-[#d4af67] bg-[#fefaef]/24 backdrop-blur-[5px] shadow-[0_16px_40px_rgba(92,69,34,0.08),0_3px_10px_rgba(92,69,34,0.04)] transition-all duration-200">
            <div 
              className="border border-[#d4af67]/45 rounded-[23px] p-5 sm:p-6 flex flex-col relative text-left"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 253, 248, 0.40) 0%, rgba(254, 250, 243, 0.20) 100%)' }}
            >
              {/* Car icon badge */}
              <div className="w-10 h-10 rounded-[10px] border border-[#c5a059]/60 bg-white/90 flex items-center justify-center text-[#634a21] mb-3.5 shadow-2xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H6c-.8 0-1.5.4-1.9 1.1L2.6 11.2C2.2 11.8 2 12.4 2 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>

              {/* Small gold letter-spaced uppercase label */}
              <div 
                className="text-[11px] font-sans font-extrabold tracking-[0.16em] uppercase text-[#734c0f] mb-2 leading-relaxed helpdesk-card-text"
              >
                TRAVEL, AIRPORT &amp; LOCAL TRANSFERS DESK
              </div>

              {/* Serif name */}
              <h2 
                className="font-serif text-[28px] sm:text-[30px] font-bold text-[#140f0a] leading-tight mb-2 tracking-tight helpdesk-card-text"
              >
                Vikram Singh
              </h2>

              {/* Clock icon + availability line */}
              <div 
                className="flex items-center gap-1.5 mb-2 text-[13.5px] font-semibold text-[#2c2217] helpdesk-card-text"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#734c0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Dehradun Airport &amp; Haridwar cab coordination</span>
              </div>

              {/* Phone number */}
              <div 
                className="text-[19px] font-sans font-extrabold text-[#140f0a] tracking-wide mb-4 helpdesk-card-text"
              >
                +91 98765 43212
              </div>

              {/* Thin gold divider */}
              <div className="h-[1px] w-full bg-[#c5a059]/40 mb-4" />

              {/* Action buttons: CALL & WHATSAPP */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+919876543212"
                  id="call-card-3"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#c5a059] bg-[#fffcf5]/95 text-[#16130f] shadow-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c601d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>CALL</span>
                </a>
                <a
                  href="https://wa.me/919876543212"
                  id="whatsapp-card-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-[42px] rounded-full text-[13px] font-bold tracking-wider uppercase border border-[#22c55e]/70 bg-[#f0fdf4]/96 text-[#15803d] shadow-xs hover:bg-[#f0fdf4] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 8 8v.5z" />
                  </svg>
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 24/7 dedicated desk note */}
        <div className="text-center mt-8 px-2 w-full max-w-full box-border flex justify-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FFFDFB]/70 backdrop-blur-md border border-[#DFC48F]/80 text-[11px] xs:text-xs font-sans font-medium text-[#4A4038] shadow-2xs max-w-full text-center box-border">
            <span className="leading-snug break-words">24/7 dedicated guest desk at Anand Kashi Reception Lobby</span>
          </div>
        </div>
      </div>

      <Divider className="mt-8 sm:mt-10" />
    </section>
  );
};
