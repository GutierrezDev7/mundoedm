# Banco de dados: Supabase

O backend usa **Prisma** com **Supabase** (PostgreSQL gerenciado).

## Configuração

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Settings > Database**:
   - Anote a **Database password** (senha do banco).
   - Em **Connection string** escolha **URI** e copie a conexão direta (porta **5432**).
3. No `.env` do backend:

```env
# Conexão direta: usuário é "postgres" (não postgres.REF). Substitua [PASSWORD] pela senha do Database.
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Importante:** Use literalmente o usuário `postgres` e a senha que aparece em **Database password**. Se a senha tiver caracteres especiais (`#`, `@`, `/`, `%`, etc.), codifique na URL (ex.: `#` → `%23`, `@` → `%40`).

4. Aplique as migrations e inicie:

```bash
npx prisma migrate deploy
npm run dev
```

Na primeira subida o backend faz o seed (social links e usuário admin) se as tabelas estiverem vazias.

## Erro "Please make sure to provide valid database credentials"

- Confira **Settings > Database > Database password** e use exatamente essa senha em `[PASSWORD]`.
- Para conexão direta (porta 5432) o usuário deve ser **postgres**, e o host **db.[seu-project-ref].supabase.co**.
- Se a senha tiver caracteres especiais, codifique: [URL encode](https://www.urlencoder.org/).
- Teste a conexão em **Settings > Database > Connection string**, abrindo "URI" e conferindo se a string está igual à do seu `.env`.
