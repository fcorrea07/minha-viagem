# Padrões de Componentes — Minha Viagem

## Estrutura de Componente Padrão

```jsx
import { useState } from 'react'
import { IconName } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'

export default function MySection() {
  const [items, setItems] = useLocalStorage('travel_key', [])
  const [localState, setLocalState] = useState(null)

  // Handlers antes do return
  function handleAdd(item) { ... }
  function handleDelete(id) { ... }

  return (
    <div className="...">
      {/* JSX aqui */}
    </div>
  )
}
```

## Persistência de Dados

- **Sempre usar `useLocalStorage`** para dados que precisam persistir
- Chaves de localStorage definidas em `src/data/seedData.js`:
  - `travel_itinerary` — roteiro
  - `travel_places` — lugares
  - `travel_checklist` — checklist
  - `travel_budget` — gastos
- Dados iniciais (seed) carregados automaticamente pelo hook se a chave não existir

## Padrão de Adição/Edição

```jsx
// Estado para controle de formulário
const [showForm, setShowForm] = useState(false)
const [editingItem, setEditingItem] = useState(null)

// Salvar: cria novo ou atualiza existente
function handleSave(formData) {
  if (editingItem) {
    setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i))
  } else {
    setItems([...items, { id: Date.now(), ...formData }])
  }
  setShowForm(false)
  setEditingItem(null)
}
```

## IDs de Itens

- Usar `Date.now()` como ID para novos itens (suficiente para uso offline)
- Sem UUID externo — o projeto não tem dependência para isso

## Status dos Itens

Cada seção tem seus próprios valores de status:
- **Roteiro:** `planejado` | `confirmado` | `concluído`
- **Lugares:** `quero ir` | `confirmado` | `visitado`
- **Checklist:** booleano (`checked: true/false`)
- **Gastos:** sem status — apenas categoria e valor

## Responsividade

- Mobile-first obrigatório
- Breakpoints principais: `sm:` (640px) e `md:` (768px)
- Grid responsivo: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
