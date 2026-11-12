// Mini-renderer Markdown + LaTeX (KaTeX) sicuro: tutto il testo viene prima
// sottoposto a escape HTML, quindi può essere usato anche per testo digitato
// dagli utenti (chat) e per le risposte del tutor AI senza rischio di XSS.
import katex from 'katex';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function tex(src: string, display: boolean, strict = false): string {
  try {
    return katex.renderToString(src, { displayMode: display, throwOnError: strict, strict: 'ignore', output: 'html', trust: false });
  } catch (e) {
    if (strict) throw e;
    return `<code>${esc(src)}</code>`;
  }
}

function inline(s: string, strict: boolean): string {
  // Separa le formule $...$ dal testo, così il Markdown non altera il LaTeX.
  const parts = s.split(/(\$[^$\n]+\$)/g);
  return parts
    .map((p) => {
      if (p.length > 2 && p.startsWith('$') && p.endsWith('$')) return tex(p.slice(1, -1), false, strict);
      return esc(p)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    })
    .join('');
}

/** Converte Markdown essenziale (paragrafi, elenchi, grassetto, corsivo, $..$, $$..$$) in HTML. */
export function renderMd(src: string, strict = false): string {
  // Le risposte dei modelli AI usano spesso \( \) e \[ \]: le normalizziamo.
  const text = src
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, f) => `$$${f}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, f) => `$${f}$`);
  const out: string[] = [];
  const chunks = text.split(/(\$\$[\s\S]+?\$\$)/g);
  for (const chunk of chunks) {
    if (chunk.startsWith('$$') && chunk.endsWith('$$') && chunk.length > 4) {
      out.push(`<div class="math-block">${tex(chunk.slice(2, -2).trim(), true, strict)}</div>`);
      continue;
    }
    for (const para of chunk.split(/\n\s*\n/)) {
      const lines = para.split('\n').filter((l) => l.trim() !== '');
      if (!lines.length) continue;
      let list: 'ul' | 'ol' | null = null;
      let buf: string[] = [];
      const flushP = () => {
        if (buf.length) out.push(`<p>${buf.map((l) => inline(l, strict)).join('<br>')}</p>`);
        buf = [];
      };
      const closeList = () => {
        if (list) out.push(`</${list}>`);
        list = null;
      };
      for (const line of lines) {
        const ul = /^\s*[-•]\s+(.*)$/.exec(line);
        const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
        const kind = ul ? 'ul' : ol ? 'ol' : null;
        if (kind) {
          flushP();
          if (list !== kind) {
            closeList();
            out.push(`<${kind}>`);
            list = kind;
          }
          out.push(`<li>${inline((ul ?? ol)![1], strict)}</li>`);
        } else {
          closeList();
          const h = /^#{1,4}\s+(.*)$/.exec(line);
          if (h) {
            flushP();
            out.push(`<h4>${inline(h[1], strict)}</h4>`);
          } else buf.push(line);
        }
      }
      flushP();
      closeList();
    }
  }
  return out.join('');
}
