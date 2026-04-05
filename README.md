# Minha Viagem 🇮🇹🇪🇸

Planejador de viagem pessoal para **Itália e Barcelona** — PWA completo, 100% offline após o primeiro acesso.

## Início rápido

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |

## Deploy no Vercel

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. O Vercel detecta automaticamente o Vite — clique em **Deploy**
4. A partir daí, **deploy automático a cada `git push`**

## Ícones PWA

Adicione dois arquivos PNG na pasta `public/icons/`:

- `icon-192.png` — 192×192 px
- `icon-512.png` — 512×512 px

Você pode gerar facilmente em [realfavicongenerator.net](https://realfavicongenerator.net) ou com qualquer editor de imagem.

## Estrutura

```
src/
├── components/
│   ├── Itinerary.jsx   # Roteiro dia a dia
│   ├── Places.jsx      # Lugares + mapa Leaflet
│   ├── Checklist.jsx   # Checklist de preparativos
│   └── Budget.jsx      # Controle de gastos
├── hooks/
│   └── useLocalStorage.js
├── data/
│   └── seedData.js     # Dados de exemplo pré-preenchidos
├── App.jsx
└── main.jsx
```

## Tecnologias

- **React + Vite** — framework e bundler
- **Tailwind CSS** — estilização
- **Leaflet.js + OpenStreetMap** — mapas (sem API key)
- **vite-plugin-pwa** — Service Worker e PWA
- **Recharts** — gráfico de pizza nos gastos
- **localStorage** — persistência total, sem backend
