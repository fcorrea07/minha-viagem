# Convenções de Código — Minha Viagem

## TypeScript

- **TypeScript obrigatório** — todos os arquivos são `.ts` ou `.tsx`
- Sem `any` — use tipos precisos ou `unknown` com narrowing
- Prefira `interface` para objetos públicos e `type` para unions/intersections:
  ```ts
  // ✅ Interface para shape de dados
  interface Place {
    id: number
    name: string
    city: string
    category: PlaceCategory
    status: PlaceStatus
    note?: string
  }

  // ✅ Type para unions
  type PlaceCategory = 'museu' | 'restaurante' | 'monumento' | 'experiência'
  type PlaceStatus = 'quero ir' | 'confirmado' | 'visitado'
  ```
- Tipagem de props com `interface`, nunca `React.FC`:
  ```tsx
  // ✅ Correto
  interface PlaceCardProps {
    name: string
    city: string
    onEdit: (id: number) => void
  }
  export default function PlaceCard({ name, city, onEdit }: PlaceCardProps) { ... }

  // ❌ Evitar
  const PlaceCard: React.FC<PlaceCardProps> = ({ name, city }) => { ... }
  ```
- Exporte os tipos/interfaces que são usados em mais de um arquivo em `src/types/`

## Clean Code

- **Funções pequenas e com responsabilidade única** — se a função faz mais de uma coisa, quebre-a
- **Nomes expressivos** — o nome deve revelar a intenção, sem precisar de comentário:
  ```ts
  // ✅ Nome revela intenção
  function filterVisitedPlaces(places: Place[]): Place[] { ... }

  // ❌ Nome genérico
  function filter(arr: any[]): any[] { ... }
  ```
- **Máximo 3 parâmetros** por função — se precisar de mais, use um objeto tipado:
  ```ts
  // ✅
  function createBudgetEntry({ category, amount, description }: CreateEntryInput) { ... }

  // ❌
  function createBudgetEntry(category: string, amount: number, description: string, date: string) { ... }
  ```
- **Evite negações em condições** — use nomes positivos:
  ```ts
  // ✅
  if (isChecked) { ... }

  // ❌
  if (!isNotChecked) { ... }
  ```
- **Early return** para reduzir aninhamento:
  ```ts
  function getStatusLabel(status: PlaceStatus): string {
    if (status === 'visitado') return 'Visitado'
    if (status === 'confirmado') return 'Confirmado'
    return 'Quero ir'
  }
  ```

## Tratamento de Erros

- **Nunca ignore erros silenciosamente** — sempre logue ou trate:
  ```ts
  // ✅
  try {
    const data = JSON.parse(stored)
    return data
  } catch (error) {
    console.error('[useLocalStorage] Falha ao parsear dados:', error)
    return initialValue
  }

  // ❌
  try {
    return JSON.parse(stored)
  } catch {}
  ```
- **Use Error boundaries** para erros de renderização em seções críticas
- **Valide dados na borda do sistema** (ex: ao ler localStorage), não no interior
- **Mensagens de erro sempre em português** e amigáveis ao usuário final

## Formatação (Prettier)

Configuração em `.prettierrc.json`:
- `semi: false` — sem ponto-e-vírgula
- `singleQuote: true` — aspas simples
- `tabWidth: 2` — 2 espaços
- `trailingComma: 'es5'` — vírgula final em objetos/arrays multi-linha
- `printWidth: 100` — máximo 100 caracteres por linha
- `arrowParens: 'avoid'` — sem parênteses em arrow functions de um parâmetro

Rodar antes de commitar: `npm run format`

## Linting (ESLint)

Configuração em `eslint.config.js`:
- TypeScript ESLint com rules recomendadas
- React Hooks rules (dependências de useEffect, etc.)
- Sem variáveis/imports não utilizados (erro, não warning)

Comandos:
```bash
npm run lint        # verificar
npm run lint:fix    # corrigir automaticamente
```

Regras principais enforçadas:
- `@typescript-eslint/no-explicit-any` — erro
- `@typescript-eslint/no-unused-vars` — erro
- `react-hooks/exhaustive-deps` — warning
- `react-hooks/rules-of-hooks` — erro

## Indentação e Formatação

- **2 espaços** para indentação (nunca tabs)
- **LF** como line ending (configurado no `.editorconfig`)
- **Linha em branco** no final de cada arquivo
- **Sem espaços em branco** no final das linhas
- Agrupar imports por categoria, com linha em branco entre grupos:
  ```ts
  // 1. React e libs externas
  import { useState, useEffect } from 'react'
  import { MapPin } from 'lucide-react'

  // 2. Hooks locais
  import useLocalStorage from '../hooks/useLocalStorage'

  // 3. Tipos
  import type { Place } from '../types'
  ```

## Ícones

- Usar **Lucide React** para ícones (já instalado)
- SVG inline permitido apenas para ícones muito específicos
- Sem icon fonts (FontAwesome, etc.)

## Estilização

- **Exclusivamente Tailwind CSS** — sem CSS inline, exceto overrides do Leaflet
- Paleta mediterrânea obrigatória:
  - Background: `bg-[#FAF8F5]`
  - Texto principal: `text-[#2C2C2C]`
  - Areia/secundário: `bg-[#E8DFD0]`
  - Azul-ardósia: `text-[#4A6FA5]` / `bg-[#4A6FA5]`
  - Terracota: `text-[#C0714F]` / `bg-[#C0714F]`
