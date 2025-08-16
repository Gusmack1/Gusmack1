import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gusmack Food Reviews",
    template: "%s | Gusmack Food Reviews",
  },
  description: "Glasgow & Scotland food guides, recommendations, and insider picks.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com'),
  openGraph: {
    title: "Gusmack Food Reviews",
    description: "Glasgow & Scotland food guides, recommendations, and insider picks.",
    url: '/',
    siteName: "Gusmack Food Reviews",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Gusmack Food Reviews',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="zNhe9-sVTOiFMJ0X6Ebw6gdoGtgxKP_Fh6f8NUYzWdQ" />
        <meta name="theme-color" content="#0b2f5b" />
        {/* Optional GA4: set NEXT_PUBLIC_GA4 in env to enable */}
        {process.env.NEXT_PUBLIC_GA4 && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Gusmack Food Reviews',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com',
              logo: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + '/logo.svg',
              sameAs: [
                'https://www.instagram.com/gusmack1/',
                'https://www.facebook.com/gusmack2/',
                'https://x.com/Gusmack12/',
                'https://www.threads.com/@gusmack1',
                'https://www.youtube.com/@GusMack',
                'https://www.tiktok.com/@GusMack1',
                'https://uk.linkedin.com/in/angus-mackay-60344a66',
                'https://www.google.com/maps/contrib/115222426206211405381/reviews/'
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Gusmack Food Reviews',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: (process.env.NEXT_PUBLIC_SITE_URL || 'https://gusmack1.com') + '/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-white`} style={{
        backgroundImage: 'url(/glasgow-skyline.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-white/95" />
          <div className="relative z-10">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `window.__reportVitalsInjected=true;` }} />
      </body>
    </html>
  );
}
