import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { VenueMapModal } from './VenueMapModal';
import { WeddingConfig } from '../types';
import { Map, Plane, Train, Home, Clock } from 'lucide-react';
import { FlowerSketchAccent } from './FlowerSketchAccent';
import { AnimatedMountainScene } from './AnimatedMountainScene';

interface TravelStayProps {
  config: WeddingConfig;
}

export const TravelStay: React.FC<TravelStayProps> = ({ config }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <section id="travel" className="pt-8 sm:pt-12 pb-12 sm:pb-16 px-3 sm:px-4 max-w-4xl mx-auto w-full relative">
      {/* ── ANIMATED TRAVEL & MOUNTAIN STAY HEADING WITH HEART-LOOP FLIGHT & LIVING MOUNTAINS ── */}
      <div className="mb-4 sm:mb-6">
        <AnimatedMountainScene eyebrow={config.travel.eyebrow || 'YOUR JOURNEY TO RISHIKESH'} />
      </div>

      {/* ── TRANSIT & STAY: NO CARDS, CLEAN CONCISE 1-2 LINES DIRECTLY ON THEME BACKGROUND ── */}
      <div className="space-y-8 max-w-lg mx-auto w-full relative z-10">
        {/* 1. By Air */}
        <RevealOnScroll delay={120}>
          <div className="flex items-start gap-4 pb-6 border-b border-[#DFC48F]/40">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Plane size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  BY AIR · JOLLY GRANT AIRPORT (DED)
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40] flex items-center gap-1">
                  <Clock size={11} className="text-[#8A5A00]" />
                  35 Mins Drive
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Direct Flights to Dehradun
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                Daily flights connect Delhi, Mumbai, Bengaluru & Ahmedabad to Jolly Grant Airport. Dedicated wedding chauffeurs will welcome you at arrivals.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2. By Rail */}
        <RevealOnScroll delay={200}>
          <div className="flex items-start gap-4 pb-6 border-b border-[#DFC48F]/40">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Train size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  BY RAIL · HARIDWAR & RISHIKESH
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40] flex items-center gap-1">
                  <Clock size={11} className="text-[#8A5A00]" />
                  4.5 Hrs from Delhi
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Vande Bharat & Express Trains
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                High-speed express trains connect New Delhi to Haridwar (HW) and Yog Nagari Rishikesh (YNRK). Continuous private shuttles are stationed for guest reception.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Sanctuary Stay */}
        <RevealOnScroll delay={280}>
          <div className="flex items-start gap-4 pb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Home size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  SANCTUARY ACCOMMODATIONS
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40]">
                  Check-in: 2:00 PM · Check-out: 11:00 AM
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Anand Kashi by the Ganges
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                Luxury riverside cottage suites with mountain views and direct private ghat access along the sacred Ganga.
              </p>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF2F0] hover:bg-[#F3E5E2] text-[#2C2117] text-[11px] font-sans font-bold tracking-wider uppercase transition-all border border-[#DFC48F] shadow-2xs active:scale-98 cursor-pointer"
                >
                  <Map size={12} className="text-[#8A5A00]" />
                  <span>Sanctuary Map & Directions</span>
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Subtle Flower Sketch Background Accent */}
      <FlowerSketchAccent
        className="absolute bottom-8 right-2 sm:right-6 w-32 sm:w-44 h-[220px] pointer-events-none z-0 hidden xs:block"
        opacity={0.18}
        rotation={8}
      />

      <VenueMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        config={config}
      />

      <Divider className="mt-8 sm:mt-10" />
    </section>
  );
};
