import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Gaurav07C | Gaurav Kumar | MERN Stack Developer | Web Developer ",
  description:
    "Gaurav Kumar is a highly skilled MERN stack developer and web developer with experience in creating modern web applications. Explore Gaurav's portfolio and services.",
  openGraph: {
    title: "Gaurav Kumar | MERN Stack Developer | Web Developer | Gaurav07C",
    description:
      "Discover Gaurav Kumar's expertise in MERN stack development and web development. Check out projects, skills, and professional services.",
    url: "https://www.gaurav07c.dev",
    type: "website",
    images: [
      {
        url: "https://www.gaurav07c.dev/meta-image.png",
        width: 1200,
        height: 630,
        alt: "Gaurav Kumar - MERN Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Kumar | MERN Stack Developer | Web Developer | Gaurav07C",
    description:
      "Looking for a skilled MERN stack and web developer? Discover Gaurav Kumar's portfolio and expertise.",
    images: ["https://www.gaurav07c.dev/meta-image.png"],
  },
  robots: "index, follow",
  keywords: [
    "Gaurav Kumar",
    "MERN stack developer",
    "web developer",
    "Gaurav07C",
    "Next.js developer",
    "frontend developer",
    "backend developer",
  ],
  icons: {
    icon: "/logofavicon.svg", // Correct path to your logo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "bg-gray-900 text-white antialiased font-sans"
        )}
      >
        {children}
      </body>
    </html>
  );
}
