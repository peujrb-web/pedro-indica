import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pedroindica.com.br'),
  title: 'Pedro Indica - Promoções, Cupons e Oportunidades no WhatsApp',
  description: 'Entre nos nossos grupos gratuitos do WhatsApp e receba em primeira mão as melhores ofertas, achados e cupons de desconto.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Pedro Indica - Promoções, Cupons e Oportunidades no WhatsApp',
    description: 'Entre nos nossos grupos gratuitos do WhatsApp e receba em primeira mão as melhores ofertas, achados e cupons de desconto.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-brand-dark text-slate-100 antialiased selection:bg-brand-cyan selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
