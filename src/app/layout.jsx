import { AuthProvider } from "./context/auth-context"
import { GroupProvider } from "./context/groupProvider"
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
                        <GroupProvider>
                                <html lang="pt">
                                    <body className={`${comfortaa.className} antialiased`}>{children}</body>
                                </html>
                        </GroupProvider>
                    </NotificationProvider>
                </SelectionProvider>
            </MovieUpdateProvider>
        </AuthProvider>
    )
}
