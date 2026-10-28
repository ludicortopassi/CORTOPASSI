# Cortopassi — Portfólio

Código completo do portfólio de Luigi Cortopassi, em português e inglês.
Site estático em HTML, CSS e JavaScript. Não precisa de instalação de dependências nem de build.

## Estrutura

- `index.html`: página inicial em português.
- `en/index.html`: página inicial em inglês.
- `projetos/` e `en/projetos/`: páginas dos projetos.
- `style.css`: estilos e responsividade.
- `app.js`: filtros, navegação das molduras e animação de abertura.
- `showcase-config.js`: configuração da área de destaque.
- `assets/`: imagens, vídeo e favicon.
- `translations-content.json`: conteúdo de referência das traduções. Os textos exibidos estão nos arquivos HTML.

## Subir no GitHub

1. Crie um repositório no GitHub.
2. Extraia este ZIP e envie todo o conteúdo da pasta `cortopassi-portfolio` para a raiz do repositório, mantendo as subpastas.
3. O arquivo `index.html` deve ficar diretamente na raiz do repositório.

## Publicar com GitHub Pages

Nas configurações do repositório, abra Pages e selecione publicação a partir de uma branch. Escolha `main` e a pasta raiz (`/root`), e salve. Quando a publicação terminar, o GitHub mostrará o endereço do site.

Os caminhos são relativos, permitindo hospedar o site também em uma subpasta de repositório. O arquivo `.nojekyll` está incluído para servir os arquivos estáticos diretamente.

## Visualizar localmente

Na pasta do projeto, execute:

```sh
python3 -m http.server 4173
```

Abra http://localhost:4173 no navegador.

## Editar

Edite os arquivos HTML de cada idioma para alterar textos. Substitua ou adicione imagens em `assets/` e atualize os caminhos correspondentes no HTML. As fontes são carregadas pelo Google Fonts e dependem de conexão à internet.

Este pacote contém os arquivos da versão publicada em 26/10/2026. Não inclui credenciais, histórico Git ou configurações internas da hospedagem anterior.
