# Padrões de Componentes — Minha Viagem

## Estrutura de Componente Padrão

```tsx
import { useState } from 'react'
import { IconName } from 'lucide-react'

import useLocalStorage from '../hooks/useLocalStorage'
import type { TravelItem } from '../types'

interface MySectionProps {
  title?: string
}

export default function MySection({ title = 'Seção' }: MySectionProps) {
  const [items, setItems] = useLocalStorage<TravelItem[]>('travel_key', [])
  const [localState, setLocalState] = useState<TravelItem | null>(null)

  function handleAdd(item: Omit<TravelItem, 'id'>): void {
    setItems(prev => [...prev, { id: Date.now(), ...item }])
  }

  function handleDelete(id: number): void {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6">{title}</h2>
    </div>
  )
}
```

## Tipos de Dados — `src/types/index.ts`

Defina todos os modelos de dados em `src/types/`:

```ts
// src/types/index.ts

export type ItineraryStatus = 'planejado' | 'confirmado' | 'concluído'
export type PlaceCategory = 'museu' | 'restaurante' | 'monumento' | 'experiência'
export type PlaceStatus = 'quero ir' | 'confirmado' | 'visitado'
export type BudgetCategory = 'hospedagem' | 'alimentação' | 'transporte' | 'atrações' | 'compras' | 'outros'

export interface ItineraryDay {
  id: number
  date: string
  city: string
  activities: string[]
  status: ItineraryStatus
}

export interface Place {
  id: number
  name: string
  city: string
  category: PlaceCategory
  status: PlaceStatus
  note?: string
}

export interface ChecklistItem {
  id: number
  label: string
  group: string
  checked: boolean
  note?: string
}

export interface BudgetEntry {
  id: number
  description: string
  category: BudgetCategory
  amountEur: number
}
```

## Persistência de Dados

- **Sempre usar `useLocalStorage`** com tipo genérico para dados persistidos:
  ```ts
  const [places, setPlaces] = useLocalStorage<Place[]>('travel_places', [])
  ```
- Chaves de localStorage definidas em `src/data/seedData.ts`:
  - `travel_itinerary` — roteiro
  - `travel_places` — lugares
  - `travel_checklist` — checklist
  - `travel_budget` — gastos
- Dados iniciais (seed) carregados automaticamente pelo hook se a chave não existir

## Padrão de Adição/Edição

```tsx
const [showForm, setShowForm] = useState(false)
const [editingItem, setEditingItem] = useState<Place | null>(null)

function handleSave(formData: Omit<Place, 'id'>): void {
  if (editingItem) {
    setPlaces(prev =>
      prev.map(p => (p.id === editingItem.id ? { ...p, ...formData } : p))
    )
  } else {
    setPlaces(prev => [...prev, { id: Date.now(), ...formData }])
  }
  setShowForm(false)
  setEditingItem(null)
}

function handleEdit(place: Place): void {
  setEditingItem(place)
  setShowForm(true)
}

function handleDelete(id: number): void {
  setPlaces(prev => prev.filter(p => p.id !== id))
}
```

## IDs de Itens

- Usar `Date.now()` como ID para novos itens (suficiente para uso offline)
- O tipo do campo é `number`, não `string`

## Status dos Itens

Use os union types definidos em `src/types/`:
- **Roteiro:** `ItineraryStatus` → `'planejado' | 'confirmado' | 'concluído'`
- **Lugares:** `PlaceStatus` → `'quero ir' | 'confirmado' | 'visitado'`
- **Checklist:** campo `checked: boolean`
- **Gastos:** `BudgetCategory` → sem status, apenas categoria e valor

## Responsividade

- Mobile-first obrigatório
- Breakpoints principais: `sm:` (640px) e `md:` (768px)
- Grid responsivo: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
