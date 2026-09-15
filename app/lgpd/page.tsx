import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conformidade LGPD",
  description:
    "Política de privacidade e tratamento de dados pessoais — Maestria Tintas e Sistemas.",
};

export default function LgpdPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-24 sm:px-8 sm:pt-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
        Conformidade
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text-primary">
        Privacidade e LGPD
      </h1>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            1. Controladora
          </h2>
          <p className="mt-3">
            Maestria Tintas e Sistemas LTDA, CNPJ 12.345.678/0001-00, Av.
            Industrial, 1500 — Distrito 5, Sorocaba/SP. Encarregado de dados
            (DPO): dpo@tintasmaestria.com.br.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            2. Dados coletados e finalidades
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Contato (nome, telefone/WhatsApp, e-mail, empresa, CNPJ quando
              fornecido) — para responder orçamentos e cotações B2B.
            </li>
            <li>
              Conteúdo da conversa de WhatsApp iniciada por você — para
              atendimento comercial.
            </li>
            <li>
              Navegação agregada e anônima (métricas de uso) — para melhoria
              do site, mediante consentimento.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            3. Conservação e segurança
          </h2>
          <p className="mt-3">
            Dados de contato são retidos pelo prazo necessário ao atendimento e
            depois anonimizados em 24 meses. Acesso restrito a pessoas
            autorizadas; transmissão sempre criptografada (TLS).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            4. Seus direitos
          </h2>
          <p className="mt-3">
            Confirmação de tratamento, acesso, correção, portabilidade,
            eliminação, revogação de consentimento e esclarecimentos: escreva
            para dpo@tintasmaestria.com.br. Não vendemos dados pessoais e não
            compartilhamos com terceiros fora das operações de atendimento e
            logística contratadas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">
            5. Cookies
          </h2>
          <p className="mt-3">
            O site usa armazenamento local (sessionStorage) apenas para manter
            a cor selecionada durante a sua visita. Métricas de navegação são
            ativadas somente após consentimento explícito.
          </p>
        </section>
      </div>
    </div>
  );
}
