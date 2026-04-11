# Convenções de Código — Minha Viagem

## JavaScript / React

- **Sem TypeScript** — JavaScript puro (.jsx)
- Componentes em **PascalCase**, arquivos `.jsx` (ex: `MyComponent.jsx`)
- Hooks customizados em **camelCase**, pasta `hooks/` (ex: `useLocalStorage.js`)
- Props **desestruturadas** diretamente na assinatura da função:
  ```jsx
  // ✅ Correto
  function PlaceCard({ name, city, category, onEdit }) { ... }

  // ❌ Evitar
  function PlaceCard(props) { const { name } = props; ... }
  ```

## Estilização

- **Exclusivamente Tailwind CSS** — sem CSS inline, exceto overrides do Leaflet
- **Sem arquivos CSS separados por componente** — usar classes utilitárias
- Paleta mediterrânea obrigatória:
  - Background: `bg-[#FAF8F5]`
  - Texto principal: `text-[#2C2C2C]`
  - Areia/secundário: `bg-[#E8DFD0]`
  - Azul-ardósia: `text-[#4A6FA5]` / `bg-[#4A6FA5]`
  - Terracota: `text-[#C0714F]` / `bg-[#C0714F]`

## Comentários

- Comentários **apenas** onde a lógica não for óbvia
- Sem JSDoc, sem comentários descritivos em código autoexplicativo
- Sem comentários de "TODO" permanentes no código commitado

## Ícones

- Usar **Lucide React** para ícones (já instalado)
- SVG inline permitido para ícones muito específicos
- Sem icon fonts (FontAwesome, etc.)

## Imports

- Imports de terceiros antes de imports locais
- Sem imports não utilizados
- Caminhos relativos para módulos locais (ex: `../hooks/useLocalStorage`)
