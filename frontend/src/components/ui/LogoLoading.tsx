import Image from "next/image";

export default function LogoLoading({
  label = "Loading Rock Lizard Adventure",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      className="grid min-h-[50dvh] flex-1 place-items-center bg-primary p-6 text-primary-foreground"
    >
      <Image
        src="/admin-login/logo.png"
        alt=""
        width={160}
        height={74}
        loading="eager"
        className="h-auto w-36 motion-safe:animate-pulse sm:w-40"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
