# CLAUDE.md — Minha Viagem (Travel Planner App)

## Visão Geral

Aplicação web de planejamento de viagem pessoal com foco em **Itália e Barcelona**.
PWA completo, 100% client-side, sem backend. Todos os dados persistidos via **localStorage**.

## Stack

- **React + Vite** — framework e bundler
- **Tailwind CSS** — estilização utilitária
- **Leaflet.js + OpenStreetMap** — mapas interativos (sem API key)
- **vite-plugin-pwa** — Service Worker e manifest para PWA/offline
- **Recharts** — gráfico de pizza na seção de gastos
- Deploy: **Vercel** (SPA rewrite configurado em `vercel.json`)

## Estrutura de Pastas

```
/
├── public/
│   ├── manifest.json
│   └── icons/            # 192x192 e 512x512
├── src/
│   ├── components/
│   │   ├── Itinerary.jsx   # Roteiro dia a dia
│   │   ├── Places.jsx      # Lugares para visitar + mapa
│   │   ├── Checklist.jsx   # Checklist de preparativos
│   │   └── Budget.jsx      # Controle de gastos
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── data/
│   │   └── seedData.js     # Dados de exemplo pré-preenchidos
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── vercel.json
├── package.json
└── README.md
```

## Design

**Paleta mediterrânea:**
- Background: `#FAF8F5` (off-white)
- Texto principal: `#2C2C2C`
- Secundário/areia: `#E8DFD0`
- Azul-ardósia: `#4A6FA5`
- Acento terracota: `#C0714F` (cor de tema do PWA)

**Princípios visuais:**
- Minimalista com muito espaço em branco
- Tipografia clean (Inter ou system-ui)
- Ícones simples (Lucide React ou SVG inline)
- Totalmente responsivo (mobile-first)

## Funcionalidades por Seção

### 1. Roteiro
- Visualização dia a dia, agrupada por destino (Itália → Barcelona)
- Cada dia: cidade, atividades, horários, status (`planejado` | `confirmado` | `concluído`)
- Adicionar, editar e reordenar itens

### 2. Lugares para Visitar
- Categorias: Museus, Restaurantes, Monumentos, Experiências
- Campos: nome, cidade, categoria, nota pessoal, status (`quero ir` | `confirmado` | `visitado`)
- Filtro por cidade e categoria
- Mapa interativo com marcadores coloridos por categoria
- Tiles do mapa cacheados via Service Worker; exibir mensagem amigável se offline

### 3. Checklist de Preparativos
- Grupos: Documentos, Hospedagem, Passagens, Saúde, Mala
- Checkbox de conclusão + campo de nota por item
- Barra de progresso geral com % concluído
- Itens pré-preenchidos com sugestões para brasileiros viajando à Europa

### 4. Gastos
- Categorias: Hospedagem, Alimentação, Transporte, Atrações, Compras, Outros
- Valores em EUR com conversão estimada para BRL
- Orçamento total definido pelo usuário
- Gráfico de pizza por categoria (Recharts)
- Resumo gasto vs. orçamento

## PWA / Offline

- `vite-plugin-pwa` com `generateSW` strategy
- Precache de todos os assets estáticos
- Manifest: nome "Minha Viagem", tema terracota `#C0714F`, `display: standalone`
- Ícones: 192x192 e 512x512
- Banner discreto na primeira visita: "Adicionar à tela inicial"
- Service Worker regenerado a cada build/deploy

## Persistência

- Hook `useLocalStorage(key, initialValue)` encapsulando `JSON.stringify/parse`
- Cada seção usa sua própria chave: `travel_itinerary`, `travel_places`, `travel_checklist`, `travel_budget`
- Dados de exemplo em `src/data/seedData.js` carregados apenas se a chave não existir no localStorage

## Convenções de Código

- Componentes em PascalCase, arquivos `.jsx`
- Hooks customizados em camelCase, pasta `hooks/`
- Props desestruturadas diretamente na assinatura da função
- Sem TypeScript — JavaScript puro
- Estilização exclusivamente com classes Tailwind (sem CSS inline, exceto Leaflet overrides)
- Comentários apenas onde a lógica não for óbvia

## Comandos

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run preview    # preview do build
```

## Deploy

- Conectar repositório GitHub ao Vercel
- Deploy automático a cada `git push` na branch principal
- `vercel.json` com rewrite SPA:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
- Vite gera assets com hash no nome — cache busting automático
