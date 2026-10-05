import React, { useEffect, useRef, useState } from 'react';
import travelMountainArtImg from '../assets/images/travel-mountain-art.png';

interface AnimatedMountainSceneProps {
  eyebrow?: string;
  className?: string;
}

export const AnimatedMountainScene: React.FC<AnimatedMountainSceneProps> = ({
  eyebrow = 'YOUR JOURNEY TO RISHIKESH',
  className = '',
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect when the section enters the viewport to trigger the full entrance sequence
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detect actual scroll container (e.g. phone screen scroll container if on desktop)
    let parent = el.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      if (parent.getAttribute('data-phone-scroll') === 'true') {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const checkVisibility = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = scrollRoot
        ? scrollRoot.getBoundingClientRect().height
        : window.innerHeight;
      const topOffset = scrollRoot
        ? rect.top - scrollRoot.getBoundingClientRect().top
        : rect.top;

      // Trigger when top enters within 85% of visible height
      if (topOffset < viewportHeight * 0.85 && rect.bottom > 0) {
        setIsStarted(true);
      }
    };

    checkVisibility();

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsStarted(true);
            if (observer && el) observer.unobserve(el);
          }
        },
        {
          root: scrollRoot,
          threshold: 0.1,
          rootMargin: '0px 0px 50px 0px',
        }
      );
      observer.observe(el);
    } catch {
      // Fallback
    }

    const scrollTarget = scrollRoot || window;
    scrollTarget.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      scrollTarget.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  // Flight path: enters from left (-180, 120), creates the heart loop directly over the letter 'a' (X ≈ 376 - 380),
  // and exits off the top-right screen (1140, -150).
  const flightPathD =
    'M -180 120 ' +
    'C -100 120 100 160 240 205 ' +
    'C 300 232 370 232 412 205 ' +
    'C 448 182 442 128 412 112 ' +
    'C 392 102 376 116 376 134 ' +
    'C 376 116 360 102 340 110 ' +
    'C 314 122 328 176 380 200 ' +
    'C 440 228 600 238 740 168 ' +
    'C 800 138 830 100 848 62 ' +
    'C 866 24 960 -40 1140 -150';

  return (
    <div
      ref={containerRef}
      className={`animated-travel-hero-wrap w-full relative select-none ${className}`}
    >
      <style>{`
        .animated-travel-hero {
          container-type: inline-size;
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          font-family: "Caveat Brush", "Comic Sans MS", cursive;
          color: #140F0A;
          text-align: center;
          overflow: visible;
        }

        /* Top Eyebrow: YOUR JOURNEY TO RISHIKESH */
        .animated-travel-hero .travel-eyebrow {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          margin-bottom: -11cqw;
        }

        .animated-travel-hero .eyebrow-text {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          font-size: 3.2cqw;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8A5A00;
          display: inline-block;
          opacity: 0;
          transform: translateY(12px);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.95);
        }

        .animated-travel-hero.anim-started .eyebrow-text {
          animation: eyebrowRise 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards;
        }

        @keyframes eyebrowRise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Dashed flight path + plane */
        .animated-travel-hero .flight {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          overflow: visible;
          z-index: 20;
          pointer-events: none;
        }

        .animated-travel-hero .trail-mask {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }

        .animated-travel-hero.anim-started .trail-mask {
          animation: drawTrail 10s linear 4.8s infinite;
        }

        @keyframes drawTrail {
          0%   { stroke-dashoffset: 1; }
          60%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        .animated-travel-hero.anim-started .trail {
          animation: trailFade 10s linear 4.8s infinite;
        }

        @keyframes trailFade {
          0%, 82% { opacity: 1; }
          94%, 100% { opacity: 0; }
        }

        .animated-travel-hero .trail-dash {
          stroke-dasharray: 6 8;
        }

        .animated-travel-hero.anim-started .trail-dash {
          animation: marchingDash 1.2s linear infinite;
        }

        @keyframes marchingDash {
          to { stroke-dashoffset: -14; }
        }

        .animated-travel-hero .heart-pulse {
          transform-box: fill-box;
          transform-origin: center;
        }

        .animated-travel-hero.anim-started .heart-pulse {
          animation: heartPulse 1.8s ease-in-out infinite;
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Big word "Travel" */
        .animated-travel-hero h1.travel {
          margin: 0;
          padding-top: 14cqw;
          font-size: 28cqw;
          line-height: .95;
          font-weight: 400;
          letter-spacing: .005em;
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          color: #140F0A;
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.85);
        }

        .animated-travel-hero .l {
          display: inline-block;
        }

        .animated-travel-hero.anim-started .l i {
          display: inline-block;
          font-style: normal;
          animation: letterWave 4.5s ease-in-out infinite;
          animation-delay: calc(var(--i) * .22s + 1.4s);
        }

        @keyframes letterWave {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-3%) rotate(-1.5deg); }
        }

        /* Subtitle "& Mountain Stay" */
        .animated-travel-hero .sub {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3cqw;
          margin-top: -1cqw;
        }

        .animated-travel-hero .sub .line {
          height: 2px;
          width: 11cqw;
          background: #140F0A;
          transform-origin: center;
          transform: scaleX(0);
          border-radius: 2px;
        }

        .animated-travel-hero.anim-started .sub .line {
          animation: lineGrow .9s ease-out 4.0s forwards;
        }

        .animated-travel-hero .sub .line.r {
          transform-origin: left;
        }

        .animated-travel-hero .sub .line.l2 {
          transform-origin: right;
        }

        @keyframes lineGrow {
          to { transform: scaleX(1); }
        }

        .animated-travel-hero .sub .txt {
          font-size: 9.5cqw;
          letter-spacing: .06em;
          white-space: nowrap;
          display: flex;
          color: #140F0A;
        }

        .animated-travel-hero .sub .w {
          display: inline-block;
          opacity: 0;
          transform: translateY(40%);
          filter: blur(6px);
        }

        .animated-travel-hero.anim-started .sub .w {
          animation: wordRise .8s ease-out forwards;
          animation-delay: calc(3.6s + var(--j) * .045s);
        }

        @keyframes wordRise {
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        .animated-travel-hero.anim-started .sub .amp {
          display: inline-block;
          margin-right: .25em;
          animation: ampSpin 6s ease-in-out 3s infinite;
        }

        @keyframes ampSpin {
          0%, 85%, 100% { transform: rotate(0); }
          92% { transform: rotate(360deg); }
        }

        /* Mountain image scene - Single crisp layer, NO duplicate shadow/sun */
        .animated-travel-hero .scene-wrap {
          position: relative;
          width: 100%;
          margin-top: 1.5cqw;
        }

        .animated-travel-hero .mask {
          position: relative;
          overflow: hidden;
          line-height: 0;
        }

        .animated-travel-hero .layer {
          position: relative;
        }

        .animated-travel-hero .layer.front img {
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          transform: scaleY(.05);
          transform-origin: 50% 100%;
          opacity: 0;
          filter: none;
          box-shadow: none;
        }

        .animated-travel-hero.anim-started .layer.front img {
          animation: mgrow 2.1s cubic-bezier(.2,.8,.25,1) .1s forwards;
        }

        @keyframes mgrow {
          to { transform: scaleY(1); opacity: 1; }
        }

        .animated-travel-hero.anim-started .layer.front {
          animation: mBreathe 7s ease-in-out 4.2s infinite alternate;
          transform-origin: 50% 100%;
        }

        @keyframes mBreathe {
          from { transform: scale(1); }
          to { transform: scale(1.025); }
        }

        .animated-travel-hero .scene-over {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
        }

        .animated-travel-hero .fade-in {
          opacity: 0;
        }

        .animated-travel-hero.anim-started .fade-in {
          animation: mFadein 1s ease-out 3s forwards;
        }

        @keyframes mFadein {
          to { opacity: 1; }
        }

        .animated-travel-hero.anim-started .cloud {
          animation: mDrift 16s ease-in-out infinite alternate;
        }

        .animated-travel-hero.anim-started .cloud.c2 {
          animation-duration: 22s;
          animation-delay: -6s;
        }

        .animated-travel-hero.anim-started .cloud.c3 {
          animation-duration: 19s;
          animation-delay: -11s;
        }

        @keyframes mDrift {
          from { transform: translateX(-30px); }
          to { transform: translateX(40px); }
        }

        .animated-travel-hero.anim-started .bird {
          transform-box: fill-box;
          transform-origin: center;
          animation: mFlap .7s ease-in-out infinite alternate;
        }

        .animated-travel-hero.anim-started .bird.b2 {
          animation-delay: .2s;
        }

        @keyframes mFlap {
          from { transform: scaleY(1); }
          to { transform: scaleY(-.6); }
        }

        .animated-travel-hero.anim-started .birds {
          animation: mGlide 14s linear infinite;
        }

        @keyframes mGlide {
          from { transform: translateX(-120px); }
          to { transform: translateX(900px); }
        }

        .animated-travel-hero.anim-started .pine {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: mSway 3.5s ease-in-out infinite alternate;
        }

        .animated-travel-hero.anim-started .pine.p2 {
          animation-delay: -1s;
        }

        .animated-travel-hero.anim-started .pine.p3 {
          animation-delay: -2s;
        }

        @keyframes mSway {
          from { transform: rotate(-2.5deg); }
          to { transform: rotate(2.5deg); }
        }

        .animated-travel-hero.anim-started .star {
          animation: mTw 2.6s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        @keyframes mTw {
          0%, 100% { opacity: .2; transform: scale(.6); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Sequence: mountains fade in -> title rises from behind -> plane flies heart path */
        .animated-travel-hero .stage {
          position: relative;
          overflow: hidden;
        }

        .animated-travel-hero .titleblock {
          position: relative;
          z-index: 1;
          transform: translateY(46cqw) scale(.25);
          opacity: 0;
        }

        .animated-travel-hero.anim-started .titleblock {
          animation: titleRise 2.4s cubic-bezier(.25,.8,.3,1) 2.2s both;
        }

        @keyframes titleRise {
          0%   { transform: translateY(46cqw) scale(.25); opacity: 0; }
          12%  { opacity: 1; }
          75%  { transform: translateY(-2cqw) scale(1.04); }
          100% { transform: none; opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-travel-hero *,
          .animated-travel-hero *::before,
          .animated-travel-hero *::after {
            animation-duration: .01s !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <header
        className={`animated-travel-hero ${isStarted ? 'anim-started' : ''}`}
        aria-label="Travel and Mountain Stay"
      >
        {/* Dashed heart-loop flight path with flying plane directly framing letter 'A' */}
        <svg className="flight" viewBox="0 0 800 240" aria-hidden="true">
          <defs>
            <mask
              id="reveal-flight"
              maskUnits="userSpaceOnUse"
              x="-500"
              y="-400"
              width="2200"
              height="1000"
            >
              <path
                className="trail-mask"
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={14}
                strokeLinecap="round"
                d={flightPathD}
              />
            </mask>
          </defs>

          <g className="trail" mask="url(#reveal-flight)">
            <path
              className="trail-dash"
              fill="none"
              stroke="#140F0A"
              strokeWidth={3}
              strokeLinecap="round"
              d={flightPathD}
            />
          </g>

          {/* Plane (nose points +x, rotates along path) */}
          <g opacity="0">
            <path
              fill="#140F0A"
              d="M22 0 L-2 -4 L-14 -20 L-20 -20 L-13 -3 L-24 -3 L-29 -10 L-33 -10 L-29 0 L-33 10 L-29 10 L-24 3 L-13 3 L-20 20 L-14 20 L-2 4 Z"
            />
            {isStarted && (
              <>
                <animateMotion
                  dur="10s"
                  begin="4.8s"
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="linear"
                  keyTimes="0;0.6;1"
                  keyPoints="0;1;1"
                  path={flightPathD}
                />
                <animate
                  attributeName="opacity"
                  dur="10s"
                  begin="4.8s"
                  repeatCount="indefinite"
                  values="0;1;1;0;0"
                  keyTimes="0;0.02;0.6;0.61;1"
                />
              </>
            )}
          </g>
        </svg>

        <div className="stage">
          <div className="titleblock">
            {/* Topic: YOUR JOURNEY TO RISHIKESH */}
            <div className="travel-eyebrow">
              <span className="eyebrow-text">{eyebrow}</span>
            </div>

            {/* "Travel" with letters waving */}
            <h1 className="travel" aria-hidden="true">
              <span className="l" style={{ ['--i' as any]: 0 }}><i>T</i></span>
              <span className="l" style={{ ['--i' as any]: 1 }}><i>r</i></span>
              <span className="l" style={{ ['--i' as any]: 2 }}><i>a</i></span>
              <span className="l" style={{ ['--i' as any]: 3 }}><i>v</i></span>
              <span className="l" style={{ ['--i' as any]: 4 }}><i>e</i></span>
              <span className="l" style={{ ['--i' as any]: 5 }}><i>l</i></span>
            </h1>

            {/* "& Mountain Stay" */}
            <div className="sub" aria-hidden="true">
              <span className="line l2" />
              <span className="txt">
                <span className="w amp" style={{ ['--j' as any]: 0 }}>&amp;</span>
                <span className="w" style={{ ['--j' as any]: 1 }}>M</span>
                <span className="w" style={{ ['--j' as any]: 2 }}>o</span>
                <span className="w" style={{ ['--j' as any]: 3 }}>u</span>
                <span className="w" style={{ ['--j' as any]: 4 }}>n</span>
                <span className="w" style={{ ['--j' as any]: 5 }}>t</span>
                <span className="w" style={{ ['--j' as any]: 6 }}>a</span>
                <span className="w" style={{ ['--j' as any]: 7 }}>i</span>
                <span className="w" style={{ ['--j' as any]: 8 }}>n</span>
                <span className="w" style={{ ['--j' as any]: 9 }}>&nbsp;</span>
                <span className="w" style={{ ['--j' as any]: 10 }}>S</span>
                <span className="w" style={{ ['--j' as any]: 11 }}>t</span>
                <span className="w" style={{ ['--j' as any]: 12 }}>a</span>
                <span className="w" style={{ ['--j' as any]: 13 }}>y</span>
              </span>
              <span className="line r" />
            </div>
          </div>

          {/* Mountain scene (image rises from behind the ground line) - Clean single layer without ghost shadow */}
          <div className="scene-wrap">
            <div className="mask">
              <div className="layer front">
                <img alt="Mountain Range with Rising Sun" src={travelMountainArtImg} />
              </div>
            </div>

            <svg className="scene-over" viewBox="0 0 800 267" aria-hidden="true">
              <g fill="#140F0A">
                <circle className="star" cx="60" cy="30" r="2.2" />
                <circle className="star" cx="330" cy="14" r="1.8" style={{ animationDelay: '.8s' }} />
                <circle className="star" cx="745" cy="40" r="2.2" style={{ animationDelay: '1.4s' }} />
                <circle className="star" cx="770" cy="95" r="1.6" style={{ animationDelay: '.4s' }} />
              </g>

              <g className="fade-in" fill="#fff" stroke="#140F0A" strokeWidth={2.2} strokeLinejoin="round">
                <g className="cloud"><path d="M70 70 q0-14 14-14 q6-12 20-8 q14-6 22 8 q14 0 14 14 z" /></g>
                <g className="cloud c2"><path d="M560 40 q0-10 10-10 q5-9 15-6 q10-4 16 6 q10 0 10 10 z" /></g>
                <g className="cloud c3"><path d="M690 110 q0-10 10-10 q5-9 15-6 q10-4 16 6 q10 0 10 10 z" /></g>
              </g>

              <g className="birds fade-in" fill="none" stroke="#140F0A" strokeWidth={2} strokeLinecap="round">
                <path className="bird" d="M0 40 q6-8 12 0 q6-8 12 0" />
                <path className="bird b2" d="M30 54 q5-6 10 0 q5-6 10 0" />
              </g>

              <g fill="#140F0A" className="fade-in">
                <g className="pine"><path d="M60 172 L72 148 L66 148 L78 124 L72 124 L84 98 L96 124 L90 124 L102 148 L96 148 L108 172 Z" transform="translate(-30 100) scale(.6) translate(30 70)" /></g>
                <g className="pine p2"><path d="M60 172 L72 148 L66 148 L78 124 L72 124 L84 98 L96 124 L90 124 L102 148 L96 148 L108 172 Z" transform="translate(20 118) scale(.45) translate(-4 100)" /></g>
                <g className="pine p3"><path d="M60 172 L72 148 L66 148 L78 124 L72 124 L84 98 L96 124 L90 124 L102 148 L96 148 L108 172 Z" transform="translate(690 100) scale(.55) translate(30 82)" /></g>
              </g>
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
};
