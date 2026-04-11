---
description: Deploy da aplicação para o Vercel via git push. Use quando o usuário quer publicar alterações em produção.
---

# Skill: Deploy para Vercel

Você está realizando o deploy da aplicação **Minha Viagem** para o Vercel.

## Processo de Deploy

O deploy é automático via `git push` — o Vercel monitora a branch principal e faz o deploy a cada push.

### Passo 1: Verificar se o build está funcionando

```bash
npm run build
```

Se o build falhar, **pare e corrija os erros antes de continuar**.

### Passo 2: Verificar o estado do git

```bash
git status
git diff
```

Confirme que apenas as alterações desejadas estão incluídas.

### Passo 3: Commit das alterações

```bash
git add <arquivos específicos>
git commit -m "descrição clara da mudança"
```

### Passo 4: Push para a branch principal

```bash
git push -u origin main
```

O Vercel detecta automaticamente o push e inicia o pipeline de deploy.

## Configuração Vercel

- `vercel.json` contém o rewrite SPA: `/(.*) → /`
- Vite gera assets com hash no nome — cache busting automático
- Sem variáveis de ambiente necessárias (app 100% client-side)

## Verificação Pós-Deploy

Após o push, acesse o dashboard do Vercel para acompanhar o status do deploy.
Verifique que:
- [ ] Build concluído sem erros
- [ ] A aplicação carrega corretamente
- [ ] PWA/Service Worker está ativo (DevTools → Application)
- [ ] localStorage persiste dados entre recarregamentos

## Rollback

Se necessário, revert o último commit:
```bash
git revert HEAD
git push -u origin main
```
