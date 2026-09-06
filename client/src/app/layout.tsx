import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { Toaster } from "sonner";
import RightClickDisableProvider from "@/components/providers/RightClickDisableProvider";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://restaurant-management-systems.vercel.app/"),
  title: {
    default: "om constructions",
    template: "%s | om constructions",
  },
  description:
    "om constructions - We are a leading construction company in Nepal, specializing in residential and commercial projects. Our team of experts is dedicated to delivering high-quality construction services, ensuring customer satisfaction and timely project completion.",
  
  // ── Canonical URL (Duplicate Content बाट बचाउन) ──
  alternates: {
    canonical: "https://restaurant-management-systems.vercel.app/",
  },

  keywords: [
    "om constructions",
    "construction company in Nepal",
    "residential construction",
    "commercial construction",
    "building contractors",
    "construction services",
    "project management",
    "renovation and remodeling",
    "architectural design",
    "civil engineering",
    "construction solutions",
    "ramkumar chaudhary",
    "om constructions nepal",
    "om constructions company",
    "om constructions services",
    "om constructions projects",
    "om constructions contractors",
    "om constructions builders",
    "om constructions architecture",
    "om constructions engineering",
    "om constructions renovation",
  ],

  authors: [
    { name: "Sushim Chaudhary", url: "https://sushimchaudhary.com.np" },
  ],

  // ── Search Engine Crawling Directive ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Google Search Console Verification Tag ──
  // verification: {
  //   google: "googlecd492f43f87b01b4",
  // },


  verification: {
  google: "zYKRPe_dM6ix_i_LV2VO2eGUDQi5q_7igS_K0cva6tg",
},


  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/RestoSync-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/RestoSync-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },

  openGraph: {
    title: "RestoSync Nepal | All-in-One Restaurant Management Software",
    description:
      "Manage restaurant orders, billing, tables, inventory, QR menus, kitchen operations, payments, and analytics from one powerful platform.",
    url: "https://restaurant-management-systems.vercel.app/",
    siteName: "RestoSync Nepal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "RestoSync Nepal - Restaurant Management Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RestoSync - Restaurant Management System Nepal",
    description: "Complete digital solution for modern restaurants in Nepal.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06B6D4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Software Application Schema
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RestoSync Nepal",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    url: "https://restaurant-management-systems.vercel.app/",
    logo: "https://restaurant-management-systems.vercel.app/logo.png",
    author: {
      "@type": "Person",
      name: "Sushim Chaudhary",
      url: "https://sushimchaudhary.com.np",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  // Local Business / Organization Schema (Nepal Local SEO को लागि)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RestoSync Nepal",
    url: "https://restaurant-management-systems.vercel.app/",
    logo: "https://restaurant-management-systems.vercel.app/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "sushimchaudhary.developer1@gmail.com",
      contactType: "customer service",
      areaServed: "NP",
      availableLanguage: ["en", "ne"],
    },
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${nunitoSans.variable} font-sans h-full antialiased`}
    >
      <head>
        {/* Software Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js');
          });
        }
      `,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        <Toaster
          richColors
          position="top-right"
          expand={false}
          toastOptions={{
            style: {
              padding: "6px 10px",
              fontSize: "10px",
              borderRadius: "4px",
              minWidth: "150px",
              maxWidth: "150px",
            },
            className: "font-sans",
          }}
        />

        <GoogleTranslate />
        <ClientProviders>
          <ThemeProvider>
            {/* <RightClickDisableProvider> */}
            {children}
            {/* </RightClickDisableProvider> */}
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}