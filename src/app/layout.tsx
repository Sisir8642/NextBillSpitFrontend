import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper"
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bro Split",
  description: "Split bills easily with your bros",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        <ThemeProviderWrapper> 
          <AuthProvider>
          {children}
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
