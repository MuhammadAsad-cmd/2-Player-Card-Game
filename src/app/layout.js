import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "2-Player Card Game",
  description: "An elegant 2-player card game where players take turns drawing cards and responding to prompts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
