import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
    title: "Dzaky Al Fauzy — Full-Stack Developer",
    description: "Portfolio of Dzaky Al Fauzy, a full-stack developer crafting high-performance digital experiences.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-full flex flex-col font-sans">
                <CustomCursor />
                {children}
            </body>
        </html>
    );
}
