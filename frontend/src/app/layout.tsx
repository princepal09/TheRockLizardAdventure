import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import styles from "./toaster.module.css";
import AppProvider from "./providers/AppProvider";
import { siteUrl } from "@/lib/site-url";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rocklizard Adventure | Treks & Expeditions Across India",
    template: "%s | Rocklizard Adventure",
  },
  description:
    "Explore guided treks and expeditions in Uttarakhand (Kumaon + Garhwal), Kashmir and Maharashtra with Rocklizard Adventure. Browse itineraries and plan your next adventure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${newsreader.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-right" theme="light" richColors className={styles.toaster} />
      </body>
    </html>
  );
}
