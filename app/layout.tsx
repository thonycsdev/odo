import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import '@primer/primitives/dist/css/functional/themes/light.css';
import './globals.css';

import { BaseStyles, ThemeProvider } from '@primer/react';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'odo — Economize. Cresça. Conquiste.',
  description:
    'Registre seus gastos, defina metas de economia e acompanhe sua evolução financeira até a liberdade financeira.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider colorMode='dark'>
          <BaseStyles>
            {children}
          </BaseStyles>
        </ThemeProvider>

      </body>
    </html >
  );
}
