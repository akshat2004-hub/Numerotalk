import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notoSansDevanagari, outfit, cinzel } from '../fonts';
import { AppShell } from '@/components/AppShell';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${notoSansDevanagari.variable} ${outfit.variable} ${cinzel.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#FFFAF3] text-[#2B2B3A] antialiased selection:bg-[#E8A317] selection:text-[#FFFFFF] transition-colors duration-150">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
