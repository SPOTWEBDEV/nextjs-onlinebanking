import type { Lang } from "./dictionaries";

export interface LandingContent {
  heroCard: { current: string; savings: string; fixed: string; transferSent: string; deliveredIn: string };
  stats: { value: string; label: string }[];
  productsTitle: string;
  productsSubtitle: string;
  products: { title: string; desc: string }[];
  learnMore: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  steps: { title: string; desc: string }[];
  whyTitle: string;
  whyDesc: string;
  whyCta: string;
  why: string[];
  securityTitle: string;
  securityDesc: string;
  securityCta: string;
  securityFeatures: string[];
  testimonialsTitle: string;
  testimonials: { name: string; role: string; quote: string }[];
  faqTitle: string;
  faqSubtitle: string;
  faqCta: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
}

export const landingContent: Record<Lang, LandingContent> = {
  pt: {
    heroCard: {
      current: "Conta Corrente",
      savings: "Poupança Reserva",
      fixed: "Depósito a Prazo 12M",
      transferSent: "Transferência enviada",
      deliveredIn: "+ Entregue em 4s",
    },
    stats: [
      { value: "2,4M+", label: "Clientes em Portugal e na Europa" },
      { value: "180+", label: "Países suportados" },
      { value: "99,98%", label: "Disponibilidade da plataforma" },
      { value: "4,9/5", label: "Avaliação nas lojas de aplicações" },
    ],
    productsTitle: "Uma app, todas as contas de que precisa.",
    productsSubtitle: "Desde o seu primeiro objetivo de poupança até gerir um negócio em crescimento, o Banco Aurora acompanha-o.",
    products: [
      { title: "Contas Particulares", desc: "Gastos do dia a dia, poupanças e objetivos numa só app." },
      { title: "Contas Empresa", desc: "Faça a gestão de salários, faturação e tesouraria com facilidade." },
      { title: "Investir", desc: "Construa uma carteira com investimento fracionado e comissões baixas." },
      { title: "Poupança", desc: "Objetivos, poupança automática e depósitos a prazo com boa taxa." },
    ],
    learnMore: "Saber mais",
    howItWorksTitle: "Como funciona",
    howItWorksSubtitle: "Do registo à primeira transferência em menos de dez minutos.",
    steps: [
      { title: "1. Abra a sua conta em minutos", desc: "Preencha os seus dados, valide a identidade com um documento e uma selfie, e comece a usar de imediato — sem ir a uma agência." },
      { title: "2. Ligue o Multibanco e o cartão virtual", desc: "Receba um cartão virtual instantâneo e peça o cartão físico gratuito, entregue em casa em 3 a 5 dias úteis." },
      { title: "3. Faça o seu dinheiro render", desc: "Crie objetivos de poupança, invista a partir de poucos euros, e acompanhe tudo com alertas em tempo real." },
    ],
    whyTitle: "Porquê o Banco Aurora?",
    whyDesc: "Construímos o Banco Aurora para quem está cansado de esperar pelo seu banco tradicional — sem filas, sem burocracia, com total transparência sobre comissões e taxas.",
    whyCta: "Conhecer a nossa história",
    why: [
      "Sem comissões de manutenção de conta",
      "Transferências SEPA instantâneas 24/7",
      "Cartão virtual disponível no momento da abertura de conta",
      "Apoio ao cliente por chat, telefone e email",
      "Aplicação disponível em Português e Inglês",
      "Autenticação biométrica e PIN de transferência em cada movimento",
    ],
    securityTitle: "Segurança em cada camada.",
    securityDesc: "Autenticação biométrica, PIN de transferência, monitorização de fraude em tempo real, e controlo total sobre os seus cartões — tudo a partir da Central de Segurança.",
    securityCta: "Visitar a Central de Segurança",
    securityFeatures: [
      "Alertas de fraude em tempo real",
      "Autenticação biométrica",
      "Notificações instantâneas",
      "Cartões com limites ajustáveis",
    ],
    testimonialsTitle: "Amado por quem detesta esperar pelo banco.",
    testimonials: [
      { name: "Mariana C.", role: "Designer freelancer", quote: "Mudar para o Banco Aurora demorou vinte minutos e desde então nunca mais deixei de olhar para a app — e isso é bom sinal." },
      { name: "Tiago A.", role: "Empresário", quote: "As confirmações instantâneas de transferência e os limites por cartão virtual mudaram a forma como pagamos a fornecedores." },
      { name: "Inês P.", role: "Gestora de produto", quote: "É genuinamente a app bancária mais rápida e mais calma que já usei, tanto no telemóvel como no computador." },
    ],
    faqTitle: "Perguntas frequentes",
    faqSubtitle: "Não encontrou o que procurava?",
    faqCta: "Ver todas as perguntas",
    faqs: [
      { q: "O meu dinheiro está protegido?", a: "Os depósitos elegíveis estão protegidos até ao limite aplicável do Fundo de Garantia de Depósitos em Portugal." },
      { q: "Quanto tempo demora uma transferência?", a: "Transferências internas são instantâneas; transferências SEPA chegam normalmente no mesmo dia útil." },
      { q: "O Banco Aurora é regulado?", a: "Este é um produto de demonstração — não presta serviços bancários reais nem está registado como instituição de crédito." },
    ],
    ctaTitle: "Pronto para um banco ao ritmo da sua vida?",
    ctaDesc: "Abra uma conta em minutos. Sem papelada, sem idas à agência, sem esperas.",
  },
  en: {
    heroCard: {
      current: "Current Account",
      savings: "Savings Reserve",
      fixed: "12M Fixed Deposit",
      transferSent: "Transfer sent",
      deliveredIn: "+ Delivered in 4s",
    },
    stats: [
      { value: "2.4M+", label: "Customers across Portugal and Europe" },
      { value: "180+", label: "Countries supported" },
      { value: "99.98%", label: "Platform uptime" },
      { value: "4.9/5", label: "App store rating" },
    ],
    productsTitle: "One app, every account you need.",
    productsSubtitle: "From your first savings goal to running a growing business, Banco Aurora keeps up with you.",
    products: [
      { title: "Personal Accounts", desc: "Everyday spending, savings, and goals in one app." },
      { title: "Business Accounts", desc: "Manage payroll, invoicing, and treasury with ease." },
      { title: "Invest", desc: "Build a portfolio with fractional investing and low fees." },
      { title: "Savings", desc: "Goals, auto-save, and fixed-term deposits with a great rate." },
    ],
    learnMore: "Learn more",
    howItWorksTitle: "How it works",
    howItWorksSubtitle: "From sign-up to your first transfer in under ten minutes.",
    steps: [
      { title: "1. Open your account in minutes", desc: "Fill in your details, verify your identity with a document and a selfie, and start using it right away — no branch visit needed." },
      { title: "2. Activate your card", desc: "Get an instant virtual card and order your free physical card, delivered in 3–5 business days." },
      { title: "3. Make your money work", desc: "Create savings goals, invest from just a few euros, and track it all with real-time alerts." },
    ],
    whyTitle: "Why Banco Aurora?",
    whyDesc: "We built Banco Aurora for people tired of waiting on their traditional bank — no queues, no paperwork, full transparency on fees and rates.",
    whyCta: "Learn our story",
    why: [
      "No account maintenance fees",
      "Instant SEPA transfers, 24/7",
      "Virtual card available the moment you open your account",
      "Customer support by chat, phone, and email",
      "App available in Portuguese and English",
      "Biometric authentication and a transfer PIN on every move",
    ],
    securityTitle: "Security in every layer.",
    securityDesc: "Biometric authentication, transfer PIN, real-time fraud monitoring, and full control over your cards — all from the Security Centre.",
    securityCta: "Visit the Security Centre",
    securityFeatures: [
      "Real-time fraud alerts",
      "Biometric authentication",
      "Instant notifications",
      "Cards with adjustable limits",
    ],
    testimonialsTitle: "Loved by people who hate waiting on their bank.",
    testimonials: [
      { name: "Mariana C.", role: "Freelance designer", quote: "Switching to Banco Aurora took twenty minutes, and I haven't stopped checking the app since — which is a good sign." },
      { name: "Tiago A.", role: "Business owner", quote: "Instant transfer confirmations and per-virtual-card limits changed how we pay suppliers." },
      { name: "Inês P.", role: "Product manager", quote: "It's genuinely the fastest, calmest banking app I've used, on both phone and desktop." },
    ],
    faqTitle: "Frequently asked questions",
    faqSubtitle: "Didn't find what you were looking for?",
    faqCta: "See all questions",
    faqs: [
      { q: "Is my money protected?", a: "Eligible deposits are protected up to the applicable limit under Portugal's Deposit Guarantee Fund." },
      { q: "How long does a transfer take?", a: "Internal transfers are instant; SEPA transfers usually arrive the same business day." },
      { q: "Is Banco Aurora regulated?", a: "This is a demo product — it doesn't provide real banking services and isn't registered as a credit institution." },
    ],
    ctaTitle: "Ready for a bank that moves at your pace?",
    ctaDesc: "Open an account in minutes. No paperwork, no branch visits, no waiting.",
  },
};
