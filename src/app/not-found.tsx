import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <span className="text-[13px] font-bold tracking-[0.16em] text-sea uppercase">Page not found</span>
      <h1 className="font-display text-4xl font-semibold">This road doesn&apos;t go anywhere.</h1>
      <p className="max-w-md text-muted">The page you&apos;re looking for has moved or never existed.</p>
      <Link href="/" className="flex h-12 items-center rounded-xl bg-sun px-5 font-bold text-ink">Back to home</Link>
    </main>
  );
}
