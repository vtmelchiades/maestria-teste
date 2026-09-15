const CHAVE_CSS = "--cor-ativa";
const CHAVE_SESSAO = "maestria:cor";

/**
 * Atmosfera cromática reativa: aplica o tom da cor ativa como variável CSS
 * global (gradientes radiais e sombras de contato leem `--cor-ativa`).
 */
export function setCorAtiva(hex: string | null): void {
  if (typeof document === "undefined") return;
  if (hex) {
    document.documentElement.style.setProperty(CHAVE_CSS, hex);
  } else {
    document.documentElement.style.removeProperty(CHAVE_CSS);
  }
}

export function setCorSessao(code: string, hex: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      CHAVE_SESSAO,
      JSON.stringify({ code, hex }),
    );
  } catch {
    // armazenamento indisponível (modo privado): segue sem persistência
  }
}

export function lerCorSessao(): { code: string; hex: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHAVE_SESSAO);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "code" in parsed &&
      "hex" in parsed &&
      typeof (parsed as { code: unknown }).code === "string" &&
      typeof (parsed as { hex: unknown }).hex === "string"
    ) {
      return parsed as { code: string; hex: string };
    }
    return null;
  } catch {
    return null;
  }
}
