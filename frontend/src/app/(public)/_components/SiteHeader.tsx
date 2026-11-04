import Logo from "./header/Logo";
import SearchBar from "./header/SearchBar";
import NavLinks from "./header/NavLinks";
import HeaderActions from "./header/HeaderActions";
import MobileMenu from "./header/MobileMenu";

const SiteHeader = () => {
  return (
    <header className="w-full border-b border-gray-800/80 bg-[#0b1120] px-4 py-3 sm:px-6 xl:px-10 xl:py-4">
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
  );
};

export default SiteHeader;
