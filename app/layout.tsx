import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Leo VectorCraft AI",
    description: "Generate SVGs with Gemini AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-zinc-950 antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
