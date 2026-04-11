---
description: Adiciona uma nova seção ao app Minha Viagem (ex: nova aba de fotos, notas, etc.). Use quando o usuário quer expandir o app com uma funcionalidade nova.
---

# Skill: Adicionar Nova Seção

Você está adicionando uma nova seção ao app **Minha Viagem**. Siga este checklist completo.

## Checklist de Implementação

### 1. Criar o componente em `src/components/`

```jsx
// src/components/NomeDaSecao.jsx
import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export default function NomeDaSecao() {
  const [items, setItems] = useLocalStorage('travel_nome_secao', [])

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6">
        Nome da Seção
      </h2>
      {/* conteúdo */}
    </div>
  )
}
```

### 2. Adicionar chave de localStorage em `src/data/seedData.js`

```js
export const seedNomeSecao = [
  // dados de exemplo iniciais
]
```

### 3. Registrar a seção em `src/App.jsx`

- Importar o componente
- Adicionar entrada no array de abas/navegação
- Renderizar condicionalmente com base na aba ativa

### 4. Seguir as regras do projeto

- Consultar `.claude/rules/code-style.md` para convenções
- Consultar `.claude/rules/component-patterns.md` para padrões de estado
- Usar paleta mediterrânea (cores definidas no CLAUDE.md)
- Mobile-first com Tailwind

### 5. Verificar

```bash
npm run dev   # Testar localmente
npm run build # Confirmar que o build não quebra
```

## Notas Importantes

- Cada seção tem sua própria chave de localStorage (`travel_nome_secao`)
- O seed data é carregado apenas se a chave não existir ainda
- Mantenha o padrão visual consistente com as 4 seções existentes
- Sem TypeScript, sem CSS externo, sem APIs externas
