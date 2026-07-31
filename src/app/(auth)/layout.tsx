import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-porcelain dark:bg-ink-950">
      <div className="mx-auto flex w-full max-w-app flex-1 flex-col px-6 py-8">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-gradient font-display text-sm font-bold text-gold-300">A</span>
          <span className="font-display text-base font-semibold">Banco Aurora</span>
        </Link>
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      </div>
    </div>
  );
}
