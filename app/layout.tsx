import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import { lines } from "@/lib/mock-data";
import { urlWhatsApp, mensagemOrcamento } from "@/lib/conversion";

export const metadata: Metadata = {
  metadataBase: new URL("https://tintasmaestria.com.br"),
  title: {
    default: "Maestria Tintas e Sistemas | A tecnologia que faz a diferença",
    template: "%s | Maestria",
  },
  description:
    "Tintas Formula, revestimentos Crepi, demarcação Stadium, proteção Julien, pisos Sols e sinalização Axion. Savoir-faire francês, fábrica em Bauru SP. Pintar é a arte de proteger.",
  openGraph: {
    title: "Maestria Tintas e Sistemas",
    description:
      "A tecnologia que faz a diferença. Catálogo técnico com simulador de rendimento, BT e FISPQ em um clique.",
    type: "website",
    locale: "pt_BR",
    siteName: "Maestria Tintas e Sistemas",
  },
};

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-950 text-white">
      <div className="grain" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">
              MAESTRIA
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
              Tintas &amp; Sistemas
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-300">
              A tecnologia que faz a diferença. Savoir-faire francês
              aplicado à obra brasileira.
            </p>
          </div>

          <nav aria-label="Catálogo">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Catálogo
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {lines.map((linha) => (
                <li key={linha.slug}>
                  <Link
                    href={`/#linha-${linha.slug}`}
                    className="text-slate-300 transition-colors hover:text-white"
                  >
                    {linha.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ferramentas">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Ferramentas
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#calculadora"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  Calculadora de rendimento
                </Link>
              </li>
              <li>
                <Link
                  href="/#acabamento"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  Simulador de acabamento
                </Link>
              </li>
              <li>
                <Link
                  href="/#destaques"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  Destaques do catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/#b2b"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  Canal B2B
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Contato
            </p>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-slate-300">
              <p>Rua José Pinelli, 1135, Distrito Industrial II</p>
              <p>Bauru SP · Showroom em Ribeirão Preto</p>
              <p>+55 14 99835-1483</p>
              <p>comercial@tintasmaestria.com.br</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Maestria Tintas e Sistemas LTDA · CNPJ 12.345.678/0001-00
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/lgpd"
              className="transition-colors hover:text-white"
            >
              Conformidade LGPD
            </Link>
            <a
              href={urlWhatsApp(mensagemOrcamento({}))}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-surface-bg text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
