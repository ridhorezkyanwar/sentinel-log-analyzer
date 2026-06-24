import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel Log Analyzer | AI-Powered Threat Intelligence",
  description: "Analyze security logs with AI for real-time threat detection and intelligence reporting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}