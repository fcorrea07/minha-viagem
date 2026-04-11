# PWA e Comportamento Offline — Minha Viagem

## Configuração PWA

- Plugin: `vite-plugin-pwa` com estratégia `generateSW`
- Todos os assets estáticos são pré-cacheados automaticamente
- Service Worker regenerado a cada `npm run build`
- Configuração em `vite.config.js`

## Manifesto

- Nome: "Minha Viagem"
- Cor tema: `#C0714F` (terracota)
- Display: `standalone`
- Ícones obrigatórios: 192x192 e 512x512 em `public/icons/`

## Mapas Offline (Leaflet)

- Tiles do OpenStreetMap são cacheados via Service Worker após primeira visita
- **Sempre exibir mensagem amigável quando offline:**
  ```jsx
  // Detectar status de conexão
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  ```

## Banner "Adicionar à Tela Inicial"

- Exibir discretamente na primeira visita
- Usar evento `beforeinstallprompt`
- Não bloquear a experiência do usuário — o banner deve ser dispensável

## Persistência Offline

- 100% client-side — sem chamadas a APIs externas (exceto tiles do mapa)
- Todos os dados no `localStorage` — funcionam 100% offline
- Nunca usar `fetch` para dados do aplicativo

## O que NÃO fazer

- Não usar APIs de terceiros que requeiram conexão para funcionalidades core
- Não exibir erros técnicos ao usuário quando offline — sempre mensagens amigáveis em português
- Não remover o Service Worker sem atualizar o manifesto
