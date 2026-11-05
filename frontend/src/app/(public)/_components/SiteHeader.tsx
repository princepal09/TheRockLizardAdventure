"use client";

import { useLayoutEffect, useRef, useState } from "react";

import Logo from "./header/Logo";
import SearchBar from "./header/SearchBar";
import NavLinks from "./header/NavLinks";
import HeaderActions from "./header/HeaderActions";
import MobileMenu from "./header/MobileMenu";

const SiteHeader = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height);
      setHeight(nextHeight);
      document.documentElement.style.setProperty("--public-header-height", `${nextHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--public-header-height");
    };
  }, []);

  return (
    <>
      <header
        id="site-navigation"
        tabIndex={-1}
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-40 w-full border-b border-gray-800/80 bg-[#0b1120] px-4 py-3 shadow-lg sm:px-6 xl:px-10 xl:py-4"
      >
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-3 xl:flex-nowrap xl:gap-x-6">
          <div className="shrink-0">
            <Logo />
          </div>
          <div className="order-last w-full md:ml-17 min-w-0 sm:order-none sm:w-auto sm:flex-1 xl:max-w-96">
            <SearchBar />
          </div>
          <div className="ml-auto hidden shrink-0 items-center gap-6 xl:flex">
            <NavLinks />
            <HeaderActions />
          </div>
          <div className="ml-auto xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-32 shrink-0 sm:h-18 xl:h-20" style={{ height }} />
    </>
  );
};

export default SiteHeader;
