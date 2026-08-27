import type {Metadata} from 'next';
import {Geist, Instrument_Serif} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/sonner';
import {TooltipProvider} from '@/components/ui/tooltip';
import {SkipToContentLink} from '@/components/skip-to-content-link';
import {MAIN_CONTENT_ID} from '@/components/observatory/app-shell';
import {siteUrl} from '@/lib/site-url';

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
  metadataBase: new URL(siteUrl),
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f0a030'},
    {media: '(prefers-color-scheme: dark)', color: '#0a0e17'},
  ],
  other: {
    // Tells the browser to use light/dark UA colors (scrollbars,
    // form controls) so they match the user's manual theme choice
    // even before the React tree mounts.
    'color-scheme': 'light dark',
  },
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
      // `dark` class is added/removed by ThemeProvider on the client.
      // Server can't read localStorage; ThemeProvider hydrates the
      // class on mount. We default to `dark` for SSR so first paint
      // matches the historical look; ThemeProvider flips it client-side
      // when the persisted preference is `light`.
      className={`dark ${geistSans.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SkipToContentLink targetId={MAIN_CONTENT_ID}>
          Skip to main content
        </SkipToContentLink>
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
