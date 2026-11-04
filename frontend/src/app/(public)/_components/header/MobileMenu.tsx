"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";

import HeaderActions from "./HeaderActions";
import NavLinks from "./NavLinks";

const iconButton = buttonVariants({ variant: "ghost", size: "icon-lg" });

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Open navigation" className={`${iconButton} text-slate-100`}>
        <Menu aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-slate-800 bg-[#0b1120] p-5 text-slate-100 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Dialog.Title className="text-base font-semibold">Navigation</Dialog.Title>
            <Dialog.Close aria-label="Close navigation" className={iconButton}>
              <X aria-hidden="true" />
            </Dialog.Close>
          </div>
          <NavLinks mobile onNavigate={() => setOpen(false)} />
          <div className="mt-4 border-t border-slate-800 pt-4">
            <HeaderActions onNavigate={() => setOpen(false)} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
