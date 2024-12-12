import { AuthProvider } from "./context/auth-context"
import { MovieUpdateProvider } from "./context/movieUpdateProvider"
import { NotificationProvider } from "./context/notificationProvider"
import { SelectionProvider } from "./context/selectionEditReview"
import "./globals.css"
import { Comfortaa } from "next/font/google"

const comfortaa = Comfortaa({
    subsets: ["latin"],
    weight: ["400", "700"],
})

export const metadata = {
    title: "Movye",
    description: "",
}

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <MovieUpdateProvider>
                <SelectionProvider>
                    <NotificationProvider>
                        <html lang="en">
                            <body className={`${comfortaa.className} antialiased`}>{children}</body>
                        </html>
                    </NotificationProvider>
                </SelectionProvider>
            </MovieUpdateProvider>
        </AuthProvider>
    )
}
