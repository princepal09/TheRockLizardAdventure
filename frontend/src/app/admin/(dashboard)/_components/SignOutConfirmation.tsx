import { LogOut } from "lucide-react";

import { DangerConfirmation } from "./DeleteConfirmation";

export default function SignOutConfirmation({ onConfirm, disabled, className }: {
  onConfirm: () => Promise<unknown>;
  disabled: boolean;
  className: string;
}) {
  return (
    <DangerConfirmation
      label={<><LogOut aria-hidden="true" className="size-4" /> Sign out</>}
      title="Sign out?"
      description="You’ll need to sign in again to access the dashboard on this device."
      confirmLabel="Sign out"
      pendingLabel="Signing out…"
      icon={LogOut}
      filledTrigger
      triggerClassName={className}
      disabled={disabled}
      onConfirm={onConfirm}
    />
  );
}
