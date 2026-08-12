"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/dictionaries";
import { CurrencyProvider } from "@/lib/currency/context";
import { InstallPrompt } from "@/components/ui/install-prompt";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
}

export function Providers({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <LanguageProvider initialLang={initialLang}>
          <CurrencyProvider>
            {children}
            <InstallPrompt />
            <ThemedToaster />
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
