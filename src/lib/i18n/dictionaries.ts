export type Lang = "pt" | "en";

export interface Dictionary {
  nav: {
    home: string;
    accounts: string;
    transfer: string;
    savings: string;
    more: string;
    notifications: string;
    settings: string;
    profile: string;
    security: string;
    support: string;
    logout: string;
    login: string;
    openAccount: string;
    learnMore: string;
  };
  marketingNav: {
    personal: string;
    business: string;
    loans: string;
    invest: string;
    about: string;
  };
  common: {
    balance: string;
    availableBalance: string;
    ledgerBalance: string;
    transactions: string;
    seeAll: string;
    confirm: string;
    cancel: string;
    save: string;
    search: string;
    loading: string;
    language: string;
  };
  landing: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    disclaimer: string;
  };
}

export const dictionaries: Record<Lang, Dictionary> = {
  pt: {
    nav: {
      home: "Início",
      accounts: "Contas",
      transfer: "Transferir",
      savings: "Poupança",
      more: "Mais",
      notifications: "Notificações",
      settings: "Definições",
      profile: "Perfil",
      security: "Segurança",
      support: "Apoio ao Cliente",
      logout: "Terminar sessão",
      login: "Entrar",
      openAccount: "Abrir conta",
      learnMore: "Saber mais",
    },
    marketingNav: {
      personal: "Particulares",
      business: "Empresas",
      loans: "Crédito",
      invest: "Investir",
      about: "Sobre nós",
    },
    common: {
      balance: "Saldo",
      availableBalance: "Saldo disponível",
      ledgerBalance: "Saldo contabilístico",
      transactions: "Movimentos",
      seeAll: "Ver tudo",
      confirm: "Confirmar",
      cancel: "Cancelar",
      save: "Guardar",
      search: "Pesquisar",
      loading: "A carregar…",
      language: "Idioma",
    },
    landing: {
      badge: "Agora com transferências internacionais instantâneas",
      title1: "O seu dinheiro,",
      title2: "sem complicações.",
      subtitle:
        "O Banco Aurora reúne o seu dia a dia, poupanças e investimentos numa só aplicação — pensada para quem quer o seu dinheiro a mexer tão depressa quanto precisa.",
      ctaPrimary: "Abrir conta gratuita",
      ctaSecondary: "Explorar funcionalidades",
      disclaimer: "Produto de demonstração — sem contas, cartões ou transferências reais.",
    },
  },
  en: {
    nav: {
      home: "Home",
      accounts: "Accounts",
      transfer: "Transfer",
      savings: "Savings",
      more: "More",
      notifications: "Notifications",
      settings: "Settings",
      profile: "Profile",
      security: "Security",
      support: "Support",
      logout: "Sign out",
      login: "Log in",
      openAccount: "Open account",
      learnMore: "Learn more",
    },
    marketingNav: {
      personal: "Personal",
      business: "Business",
      loans: "Loans",
      invest: "Invest",
      about: "About",
    },
    common: {
      balance: "Balance",
      availableBalance: "Available balance",
      ledgerBalance: "Ledger balance",
      transactions: "Transactions",
      seeAll: "See all",
      confirm: "Confirm",
      cancel: "Cancel",
      save: "Save",
      search: "Search",
      loading: "Loading…",
      language: "Language",
    },
    landing: {
      badge: "Now with instant international transfers",
      title1: "Banking that feels",
      title2: "effortless.",
      subtitle:
        "Banco Aurora brings spending, saving, and investing into one premium app — built for people who want their money to move as fast as they do.",
      ctaPrimary: "Open a free account",
      ctaSecondary: "Explore features",
      disclaimer: "Demo product for illustration only — no real accounts, cards, or transfers.",
    },
  },
};
