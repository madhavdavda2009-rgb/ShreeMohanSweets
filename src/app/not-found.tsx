import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page grid min-h-dvh content-center justify-items-start">
      <h1 className="heading text-5xl md:text-7xl">Page not found</h1>
      <p className="mt-3 text-lg text-muted">This page has moved or never existed.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
