"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu as MenuIcon,
  MessageCircle,
  X,
} from "lucide-react";
import {
  Menu as RadixMenu,
  MenuAnchor as RadixMenuAnchor,
  MenuContent as RadixMenuContent,
  MenuItem as RadixMenuItem,
  MenuPortal as RadixMenuPortal,
  MenuSeparator as RadixMenuSeparator,
} from "@radix-ui/react-menu";
import { contarPorLinha, lines } from "@/lib/mock-data";
import { mensagemOrcamento, urlWhatsApp } from "@/lib/conversion";

const FERRAMENTAS = [
  { label: "Calculadora", href: "/#calculadora" },
  { label: "Simulador de acabamento", href: "/#acabamento" },
  { label: "Canal B2B", href: "/#b2b" },
];

function Logo() {
  return (
    <Link href="/" className="flex flex-col leading-none" aria-label="Maestria, página inicial">
      <span className="font-display text-lg font-extrabold tracking-tight text-text-primary">
        MAESTRIA
      </span>
      <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400">
        Tintas &amp; Sistemas
      </span>
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-surface-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-8">
        <Logo />

        {/* Navegação desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          <RadixMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <RadixMenuAnchor asChild>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
              >
                Produtos
                <ChevronDown
                  className={`size-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </RadixMenuAnchor>
            <RadixMenuPortal>
              <RadixMenuContent
                align="start"
                sideOffset={10}
                className="z-50 w-80 rounded-lg border border-slate-200 bg-surface-bg p-2 shadow-e3"
              >
                {lines.map((linha) => (
                  <RadixMenuItem
                    key={linha.slug}
                    asChild
                    onSelect={() => setMenuOpen(false)}
                    className="rounded-md outline-none transition-colors data-[highlighted]:bg-surface-alt"
                  >
                    <Link
                      href={`/#linha-${linha.slug}`}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <img
                        src={linha.image}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-text-primary">
                          {linha.name}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                          {contarPorLinha(linha.slug)} produtos no catálogo
                        </span>
                      </span>
                    </Link>
                  </RadixMenuItem>
                ))}
                <RadixMenuSeparator className="my-2 h-px bg-slate-100" />
                <RadixMenuItem
                  asChild
                  onSelect={() => setMenuOpen(false)}
                  className="rounded-md outline-none transition-colors data-[highlighted]:bg-surface-alt"
                >
                  <Link
                    href="/#destaques"
                    className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-primary-700"
                  >
                    Ver destaques do catálogo
                  </Link>
                </RadixMenuItem>
              </RadixMenuContent>
            </RadixMenuPortal>
          </RadixMenu>

          {FERRAMENTAS.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
            >
              {f.label}
            </Link>
          ))}
        </nav>

        {/* Ações à direita */}
        <div className="flex items-center gap-2">
          <a
            href={urlWhatsApp(mensagemOrcamento({ detalhe: "Quero falar com o time comercial." }))}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            className="hidden size-10 items-center justify-center rounded-md border border-slate-200 text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700 sm:flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
          </a>
          <a
            href={urlWhatsApp(mensagemOrcamento({ detalhe: "Quero ser atendido pelo time comercial." }))}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 sm:inline-flex"
          >
            Solicitar orçamento
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="menu-mobile"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="flex size-10 items-center justify-center rounded-md border border-slate-200 text-text-secondary md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div
          id="menu-mobile"
          className="border-t border-slate-200 bg-surface-bg px-6 pb-8 pt-4 shadow-e3 md:hidden"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            Catálogo
          </p>
          <ul className="mt-3 space-y-1">
            {lines.map((linha) => (
              <li key={linha.slug}>
                <Link
                  href={`/#linha-${linha.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-surface-alt"
                >
                  {linha.name}
                  <span className="font-mono text-[10px] text-slate-400">
                    {contarPorLinha(linha.slug)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            Ferramentas
          </p>
          <ul className="mt-3 space-y-1">
            {FERRAMENTAS.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-surface-alt"
                >
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={urlWhatsApp(mensagemOrcamento({ detalhe: "Quero ser atendido pelo time comercial." }))}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-accent-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Solicitar orçamento
          </a>
        </div>
      )}
    </header>
  );
}
