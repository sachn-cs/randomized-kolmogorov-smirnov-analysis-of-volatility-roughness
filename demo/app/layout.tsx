import type {Metadata} from 'next';
import {Geist, Instrument_Serif} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/sonner';
import {TooltipProvider} from '@/components/ui/tooltip';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'hurstify',
    template: '%s · hurstify',
  },
  description:
    'hurstify — randomized Kolmogorov–Smirnov estimator for rough-volatility Hurst parameters. Pure JavaScript, zero dependencies.',
  applicationName: 'hurstify',
  metadataBase: new URL('https://hurstify.dev'),
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f0a030'},
    {media: '(prefers-color-scheme: dark)', color: '#0a0e17'},
  ],
  openGraph: {
    title: 'hurstify',
    description:
      'Randomized Kolmogorov–Smirnov estimator for rough-volatility Hurst parameters.',
    type: 'website',
    images: ['/brand/wordmark.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hurstify',
    description:
      'Randomized Kolmogorov–Smirnov estimator for rough-volatility Hurst parameters.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <TooltipProvider delayDuration={150}>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
