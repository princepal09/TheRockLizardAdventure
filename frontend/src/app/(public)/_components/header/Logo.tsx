import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 text-primary-foreground">
      <Image 
        width={120} 
        height={40} 
        src="/rocklizard-logo.svg" 
        alt="Rock Lizard Logo"
        priority
      />
    </div>
  );
};

export default Logo;