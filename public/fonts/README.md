# Fontes Gotham

O site usa a família **Gotham** carregada a partir desta pasta.

## Estrutura atual

Cada variante fica em sua própria subpasta, com o arquivo `.otf` ou `.ttf`:

- `Gotham Thin/` — peso 100
- `Gotham Extra Light/` — peso 200
- `Gotham Light/` — peso 300
- `Gotham Book/` — peso 400
- `Gotham Regular/` — peso 400
- `Gotham Medium/` — peso 500
- `Gotham Bold/` — peso 700
- `Gotham Black/` — peso 800
- `Gotham Ultra/` — peso 900
- Itálicos: `Gotham Italic/`, `Gotham ItalicBold/`, `Gotham Bold Italic/`, etc.

O CSS em `app/globals.css` já aponta para esses caminhos. Se os arquivos não forem encontrados, o site usa **Montserrat** (Google Fonts) como fallback.
