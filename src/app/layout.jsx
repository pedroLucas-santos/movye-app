import { AuthProvider } from "./context/auth-context"
import { ContentTypeProvider } from "./context/contentTypeProvider"
import { GroupProvider } from "./context/groupProvider"
import { MovieUpdateProvider } from "./context/movieUpdateProvider"
import { NotificationProvider } from "./context/notificationProvider"
import { SelectionProvider } from "./context/selectionEditReview"
import "./globals.css"
import { Comfortaa } from "next/font/google"
import { ToastContainer } from "react-toastify"

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
                            <ContentTypeProvider>
                                <html lang="pt">
                                    <body className={`${comfortaa.className} antialiased bg-primary-dark dark`}>
                                        {children}{" "}
                                        <ToastContainer
                                            position="top-left"
                                            hideProgressBar={true}
                                            pauseOnHover
                                            newestOnTop={true}
                                            toastStyle={{
                                                backgroundColor: "#141414",
                                                color: "#ffffff",
                                                borderRadius: "8px",
                                                padding: "12px",
                                                fontSize: "14px",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                                            }}
                                        />
                                    </body>
                                </html>
                            </ContentTypeProvider>
                        </GroupProvider>
                    </NotificationProvider>
                </SelectionProvider>
            </MovieUpdateProvider>
        </AuthProvider>
    )
}
