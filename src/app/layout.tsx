import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { GlobalSearchHandler } from "@/components/chat/GlobalSearchHandler";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  title: "ORBI",
  description: "ORBI - AI chatbot with insights from Calendar, Gmail, Slack, Jira & more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Fira+Code:wght@300..700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          <ThemeProvider>
            <ConvexClientProvider>
              <GlobalSearchHandler />
              {children}
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
