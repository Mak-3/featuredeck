"use client";

import { motion } from "framer-motion";

export default function IPhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[260px] h-[380px] bg-accent/15 rounded-full blur-[100px]" />
      </div>

      {/* iPhone frame */}
      <div className="relative w-[260px] sm:w-[290px] md:w-[310px]">
        <div className="relative bg-[#1a1a1a] rounded-[3rem] p-[10px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_70px_-15px_rgba(0,0,0,0.5),0_0_50px_rgba(232,93,4,0.06)]">
          {/* Side buttons */}
          <div className="absolute -right-[2.5px] top-[120px] w-[3px] h-[50px] bg-[#2a2a2a] rounded-r-sm" />
          <div className="absolute -left-[2.5px] top-[100px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[2.5px] top-[140px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[2.5px] top-[72px] w-[3px] h-[16px] bg-[#2a2a2a] rounded-l-sm" />

          {/* Screen bezel */}
          <div className="relative bg-black rounded-[2.4rem] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 w-[90px] h-[26px] bg-black rounded-full" />

            {/* Screen — using <img> so GIF animations play */}
            <div className="relative aspect-[9/19.5]">
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
