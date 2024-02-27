import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <div style={{ textAlign: "center", padding: "10px" }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
