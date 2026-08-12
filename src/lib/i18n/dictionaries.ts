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
  pages: {
    accounts: string;
    transfer: string;
    cards: string;
    transactionHistory: string;
    beneficiaries: string;
    payBills: string;
    mobileTopup: string;
    qrPayments: string;
    deposit: string;
    loans: string;
    savings: string;
    investments: string;
    notifications: string;
    settings: string;
    profile: string;
    securityCentre: string;
    kyc: string;
    analytics: string;
    support: string;
  };
  auth: {
    welcomeBack: string;
    loginSubtitle: string;
    email: string;
    password: string;
    forgotPassword: string;
    loginButton: string;
    useBiometrics: string;
    newToBank: string;
    createAccount: string;
    loginDemoTip: string;
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    phone: string;
    confirmPassword: string;
    agreePrefix: string;
    terms: string;
    and: string;
    privacyPolicy: string;
    createAccountButton: string;
    alreadyHaveAccount: string;
    logIn: string;
    verifyCode: string;
    resendCode: string;
    demoCodeTip: string;
    noCodeTip: string;
  };
  settings: {
    darkMode: string;
    changePassword: string;
    transferPin: string;
    biometrics: string;
    notificationPreferences: string;
    linkedDevices: string;
    signOut: string;
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
    pages: {
      accounts: "Contas",
      transfer: "Transferir Dinheiro",
      cards: "Cartões",
      transactionHistory: "Histórico de Movimentos",
      beneficiaries: "Beneficiários",
      payBills: "Pagar Contas",
      mobileTopup: "Carregamento Telemóvel",
      qrPayments: "Pagamentos QR",
      deposit: "Depositar Fundos",
      loans: "Crédito",
      savings: "Poupança",
      investments: "Investimentos",
      notifications: "Notificações",
      settings: "Definições",
      profile: "Perfil",
      securityCentre: "Central de Segurança",
      kyc: "Verificação de Identidade",
      analytics: "Análises",
      support: "Apoio ao Cliente",
    },
    auth: {
      welcomeBack: "Bem-vindo(a) de volta",
      loginSubtitle: "Entre na sua conta Banco Aurora.",
      email: "Email",
      password: "Palavra-passe",
      forgotPassword: "Esqueceu-se da palavra-passe?",
      loginButton: "Entrar",
      useBiometrics: "Usar biometria",
      newToBank: "Novo no Banco Aurora?",
      createAccount: "Criar uma conta",
      loginDemoTip: "Use a conta de demonstração (mariana.costa@example.com) ou uma conta que acabou de registar.",
      registerTitle: "Crie a sua conta",
      registerSubtitle: "Demora cerca de dois minutos. Sem papelada.",
      fullName: "Nome completo",
      phone: "Número de telefone",
      confirmPassword: "Confirmar palavra-passe",
      agreePrefix: "Concordo com os",
      terms: "Termos",
      and: "e",
      privacyPolicy: "Política de Privacidade",
      createAccountButton: "Criar conta",
      alreadyHaveAccount: "Já tem uma conta?",
      logIn: "Entrar",
      verifyCode: "Verificar",
      resendCode: "Reenviar código",
      demoCodeTip: "Sem recebê-lo? Contacte o apoio ao cliente — um agente pode consultar o seu código atual na consola de administração.",
      noCodeTip: "Não recebeu o código? Abra o chat de apoio e peça a um agente — ele pode consultá-lo por si.",
    },
    settings: {
      darkMode: "Modo escuro",
      changePassword: "Alterar palavra-passe",
      transferPin: "PIN de transferência",
      biometrics: "Biometria",
      notificationPreferences: "Preferências de notificação",
      linkedDevices: "Dispositivos associados",
      signOut: "Terminar sessão",
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
    pages: {
      accounts: "Accounts",
      transfer: "Transfer Money",
      cards: "Cards",
      transactionHistory: "Transaction History",
      beneficiaries: "Beneficiaries",
      payBills: "Pay Bills",
      mobileTopup: "Mobile Top-up",
      qrPayments: "QR Payments",
      deposit: "Deposit Funds",
      loans: "Loans",
      savings: "Savings",
      investments: "Investments",
      notifications: "Notifications",
      settings: "Settings",
      profile: "Profile",
      securityCentre: "Security Centre",
      kyc: "Identity Verification",
      analytics: "Analytics",
      support: "Support",
    },
    auth: {
      welcomeBack: "Welcome back",
      loginSubtitle: "Log in to your Banco Aurora account.",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      loginButton: "Log in",
      useBiometrics: "Use biometrics",
      newToBank: "New to Banco Aurora?",
      createAccount: "Create an account",
      loginDemoTip: "Use the demo account (mariana.costa@example.com) or an account you just registered.",
      registerTitle: "Create your account",
      registerSubtitle: "Takes about two minutes. No paperwork.",
      fullName: "Full name",
      phone: "Phone number",
      confirmPassword: "Confirm password",
      agreePrefix: "I agree to the",
      terms: "Terms",
      and: "and",
      privacyPolicy: "Privacy Policy",
      createAccountButton: "Create account",
      alreadyHaveAccount: "Already have an account?",
      logIn: "Log in",
      verifyCode: "Verify",
      resendCode: "Resend code",
      demoCodeTip: "Didn't receive it? Contact support and an agent can look up your current code in the admin console.",
      noCodeTip: "Didn't get a code? Open Support Chat and ask an agent — they can look it up for you.",
    },
    settings: {
      darkMode: "Dark mode",
      changePassword: "Change password",
      transferPin: "Transfer PIN",
      biometrics: "Biometrics",
      notificationPreferences: "Notification preferences",
      linkedDevices: "Linked devices",
      signOut: "Sign out",
    },
  },
};
