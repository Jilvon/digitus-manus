# Variáveis de Ambiente para Railway

Configure estas variáveis no painel do Railway em **Variables**:

## Obrigatórias

| Variável | Descrição | Como obter |
|----------|-----------|------------|
| `DATABASE_URL` | String de conexão MySQL | Gerada automaticamente ao adicionar o plugin MySQL no Railway |
| `JWT_SECRET` | Segredo para cookies de sessão | Gere com: `openssl rand -hex 32` |
| `NODE_ENV` | Ambiente de execução | Defina como `production` |

## Opcionais (Notificações Manus)

| Variável | Descrição |
|----------|-----------|
| `BUILT_IN_FORGE_API_URL` | URL da API Manus Forge |
| `BUILT_IN_FORGE_API_KEY` | Chave da API Manus Forge |

## SQL de Migração

Execute no banco de dados MySQL após o deploy:

```sql
CREATE TABLE `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
```
