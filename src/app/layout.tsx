import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/widgets/header/Navigation";
import { AuthProvider } from "@/shared/hooks/useAuth";

export const metadata: Metadata = {
  title: {
    default: "CleanTask - Gestión de Tareas",
    template: "%s | CleanTask"
  },
  description: "Aplicación moderna de gestión de tareas construida con Next.js 15, React Server Components y TypeScript.",
  keywords: ["tareas", "productividad", "gestión", "nextjs", "react"],
  authors: [{ name: "CleanTask Team" }],
  creator: "CleanTask",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://cleantask.app",
    title: "CleanTask - Gestión de Tareas",
    description: "Gestiona tus tareas de manera eficiente con CleanTask",
    siteName: "CleanTask",
  },
  twitter: {
    card: "summary_large_image",
    title: "CleanTask - Gestión de Tareas",
    description: "Gestiona tus tareas de manera eficiente con CleanTask",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-gray-50 sm:bg-gradient-to-br sm:from-indigo-50 sm:via-purple-50 sm:to-pink-50 md:bg-gradient-to-br md:from-blue-50 md:via-indigo-50 md:to-purple-50 lg:bg-gradient-to-br lg:from-slate-50 lg:via-gray-50 lg:to-slate-100">
        <AuthProvider>
          <Navigation />
          <main className="relative z-10">
            {children}
          </main>
        </AuthProvider>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-300">
              © 2024 CleanTask. Construido con Next.js 15, React Server Components y TypeScript.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Usando PNPM, Tailwind CSS, ESLint y Turbopack para una experiencia de desarrollo óptima.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
