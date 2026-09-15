import Link from "next/link";
import type { Product } from "@/types/catalog";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Card editorial de produto.
 * Sem aninhamento de links: imagem + título formam um único link;
 * os CTAs são links separados, fora do primeiro.
 */
export default function ProductCard({ product }: { product: Product }) {
  const preco = product.formats.find((f) => f.priceBRL !== undefined)?.priceBRL;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-surface-bg shadow-e1 transition-[border-color,box-shadow] duration-200 hover:border-primary-300 hover:shadow-e2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-surface-inset">
        <Link
          href={`/produtos/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <img
            src={product.images.lata}
            alt={`Lata de ${product.name}, linha ${product.subline}`}
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded bg-surface-bg/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600 backdrop-blur">
          {product.subline}
        </span>
        <span className="absolute right-3 top-3 rounded bg-primary-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
          {product.base === "agua" ? "Base água" : "Base solvente"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <Link
          href={`/produtos/${product.slug}`}
          className="font-display text-lg font-semibold leading-snug tracking-tight text-text-primary transition-colors hover:text-primary-700"
        >
          {product.name}
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
          {product.finishes.join(" · ")}
        </p>
        <p className="font-mono text-xs text-text-secondary tabular-nums">
          {product.formats.map((f) => f.size).join(" · ")}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="font-mono text-sm text-text-secondary tabular-nums">
            {preco !== undefined ? BRL.format(preco) : "Sob consulta"}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/produtos/${product.slug}#especificacoes`}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              Ficha técnica
            </Link>
            <Link
              href={`/produtos/${product.slug}#comprar`}
              className="rounded-md bg-primary-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-800"
            >
              Orçar
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
