'use client';
// import type { Metadata } from "next";
import { Mona_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PuzzleWalletProvider } from '@puzzlehq/sdk';

// export const metadata: Metadata = {
//   title: "Backerboost - A Web3 Crowdfunding and Project Management Platform",
//   description:
//     "BackerBoost - Web3 Crowdfunding & Project Management. BackerBoost is a decentralized crowdfunding and project management platform designed to empower creators, developers, and innovators. Built on Web3 technologies, it enables users to showcase their projects, secure funding transparently, and engage with a global community of backers. Whether it's a school project, a startup idea, or an open-source initiative, BackerBoost provides a seamless way to manage contributions, track milestones, and ensure accountability using blockchain-based smart contracts. Ideal for hackathons, students, and entrepreneurs, BackerBoost bridges funding and innovation, fostering collaboration in a trustless and decentralized ecosystem. 🚀",
// };



const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.variable} ${inter.variable} antialiased`}>
        <PuzzleWalletProvider>{children}</PuzzleWalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
