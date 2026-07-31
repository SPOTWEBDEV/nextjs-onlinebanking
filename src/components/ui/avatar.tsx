import { cn } from "@/lib/utils";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-vault-gradient text-sm font-semibold text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}
