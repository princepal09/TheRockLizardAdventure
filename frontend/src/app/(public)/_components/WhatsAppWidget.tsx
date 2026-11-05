"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const WhatsAppWidget = () => {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const animate = reduceMotion === false;
  const phoneNumber = "+917618486202"; // Cleaned up formatting for URL compatibility
  const message = encodeURIComponent(
    "Hello! I want to know more about your treks and packages.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      className="fixed right-6 bottom-6 z-50 flex items-center"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#25D366]/50 bg-[#25D366]/20"
          initial={{ scale: 1, opacity: 0 }}
          animate={animate ? { scale: [1, 1.8], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
          transition={animate ? { duration: 1.8, delay: ring * 0.9, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" } : { duration: 0 }}
        />
      ))}
      {/* Tooltip label that appears on hover */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: hovered || focused ? 1 : 0, x: hovered || focused ? 0 : 4 }}
        transition={{ duration: animate ? 0.2 : 0 }}
        className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-lg"
      >
        Chat with us on WhatsApp
      </motion.span>

      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        // Keep SSR and hydration identical when Motion enables tap gestures.
        tabIndex={0}
        whileHover={animate ? { scale: 1.08, backgroundColor: "#20ba5a" } : undefined}
        whileTap={animate ? { scale: 0.95 } : undefined}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
      >
        {/* Official WhatsApp Brand SVG Icon */}
        <svg
          aria-hidden="true"
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.84 9.84 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppWidget;
