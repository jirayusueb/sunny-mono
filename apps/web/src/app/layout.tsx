import type { Metadata } from "next";
import {
	IBM_Plex_Mono,
	IBM_Plex_Sans_Thai,
	IBM_Plex_Serif,
} from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "../index.css";

import { Providers } from "@/components";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
	variable: "--font-sans",
	subsets: ["thai", "latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const ibmPlexSerif = IBM_Plex_Serif({
	variable: "--font-serif",
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Next.js + Elysia Template",
	description: "A modern web application template",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	const fontClasses = [
		ibmPlexSansThai.variable,
		ibmPlexSerif.variable,
		ibmPlexMono.variable,
		"antialiased",
	].join(" ");

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={fontClasses}>
				<Providers>
					<Toaster />
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
