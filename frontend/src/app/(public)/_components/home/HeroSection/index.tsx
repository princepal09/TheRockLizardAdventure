import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Next.js Image component for background */}
      <Image
        src="/your-hero-image.jpg" // Place your image inside the public/ folder
        alt="Himalayan landscape background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#0b1120]/70 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/50 to-transparent z-10" />

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          The Glaciers Are Calling
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
          Explore authentic high-altitude treks and custom expeditions across the Himalayas.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;