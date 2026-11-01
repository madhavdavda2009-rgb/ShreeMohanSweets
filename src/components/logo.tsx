import Image from "next/image";

// The title half of the client's logo image (logo.jpeg), cropped and otherwise untouched.
// The SM mark from the same image is the favicon (src/app/icon.png).
// Never redraw or recolour it. Its background is --color-blush, so it needs that behind it.
export function Logo({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-title.webp"
      alt="Shree Mohan Sweets and Namkeen, since 1979"
      width={1160}
      height={446}
      priority
      className={className}
    />
  );
}
