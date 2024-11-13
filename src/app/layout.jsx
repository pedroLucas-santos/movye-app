import "./globals.css";
import { Comfortaa } from "next/font/google"



const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata = {
  title: "Movye",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
