# 🎧 WinAmp-ed

> Uma Wikipédia alternativa da música underground — arquivo digital inspirado na estética Y2K / Frutiger Aero / Web 2.0.

Repositório: [github.com/cofeezz/WinAmp-ed](https://github.com/cofeezz/WinAmp-ed)

---

## Diagrama da Stack

```mermaid
graph LR
    A[👤 Usuário<br/>Navegador] -->|HTTPS| B[🖥️ Front-end<br/>Angular - Vercel]
    B -->|fetch/HTTP - JSON<br/>Authorization: Bearer JWT| C[⚙️ API REST<br/>Express - Render]
    C -->|Prisma Client<br/>SQL via TCP| D[(🗄️ Banco MySQL<br/>Hospedado)]

    E[📂 GitHub<br/>underground-wiki-api] -.->|Webhook / Auto Deploy| C
    F[📂 GitHub<br/>WinAmp-ed frontend] -.->|Webhook / Auto Deploy| B
```

## Explicação do diagrama

**Front-end (Vercel):** quando o usuário acessa o site, o navegador carrega os arquivos estáticos do Angular (HTML, CSS, JS compilado) servidos pela Vercel. A partir daí, toda interação que precisa de dados reais (listar artistas, buscar uma página wiki, fazer login) dispara uma requisição HTTP para a API.

**Front-end → API:** as requisições trafegam em **JSON** via **HTTPS**. Para rotas protegidas (criar página, editar perfil), o front-end envia o token JWT no header `Authorization: Bearer <token>`, salvo no `localStorage` no momento do login.

**API (Render):** o servidor Express recebe a requisição, passa pelas camadas de *middleware* (CORS, autenticação JWT), valida os dados no controller e, se necessário, consulta o banco através do **Prisma Client**.

**API → Banco de dados:** a comunicação acontece via **conexão SQL (TCP)**, usando a `DATABASE_URL` para autenticar e localizar o banco MySQL hospedado. O Prisma traduz as chamadas (`prisma.artist.findMany()`, etc.) em queries SQL e devolve os dados já tipados para a API.

**Banco → API → Front-end:** o banco responde com os dados brutos, o Prisma converte em objetos JS, a API formata a resposta em JSON com o status HTTP apropriado (200, 201, 404, etc.) e devolve ao front-end, que renderiza isso na interface (cards de artistas, páginas wiki, perfis).

**Onde o GitHub entra:** o GitHub é a **fonte da verdade** do código. Existem dois repositórios — um para o front-end (`WinAmp-ed`) e outro para a API (`underground-wiki-api`). Cada plataforma de hospedagem (Vercel e Render) está conectada ao respectivo repositório e fica "escutando" por novos commits na branch principal para disparar um novo deploy automaticamente.

---

## Front-end consumindo a API em produção

- **Tecnologia:** Angular 17 (standalone components), SCSS, TypeScript.
- **Hospedagem do front-end:** [Vercel](https://win-amp-ed.vercel.app/)
- **Hospedagem da API:** [Render](https://underwiki-api.onrender.com) 

### Como a URL da API foi configurada

A URL base da API **não fica hardcoded** nos componentes — ela vem dos arquivos de ambiente do Angular, que trocam automaticamente dependendo do tipo de build:

```ts
// src/environments/environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api'
};
```

```ts
// src/environments/environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://underwiki-api.onrender.com' // URL pública da API no Render
};
```

Quando o build de produção é gerado (`ng build --configuration production`), o Angular substitui automaticamente o `environment.ts` pelo `environment.prod.ts`. Assim, todos os `services` (`ArtistService`, `AuthService`, etc.) que importam `environment.apiUrl` passam a apontar para a URL pública da API hospedada — sem precisar alterar nenhum código.

### Prints:

<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/cf57f7e8-1a0e-44c9-8d01-e5745b9c0862" />


<img width="1909" height="950" alt="image" src="https://github.com/user-attachments/assets/076eed33-887c-4828-b5bb-620bc326bbd8" />



---

##  Como o GitHub conecta tudo

**Por que repositórios separados:** o front-end e a API são aplicações independentes, com ciclos de vida, tecnologias e processos de deploy diferentes (Angular/Vercel vs. Node+Prisma/Render). Separar os repositórios permite:
- atualizar e re-deployar um sem afetar o outro;
- manter histórico de commits organizado por responsabilidade;
- aplicar permissões e variáveis de ambiente específicas para cada contexto.

**Como Vercel e Render monitoram o GitHub:** ao conectar um repositório, cada plataforma instala um **webhook** no GitHub. Esse webhook avisa a plataforma sempre que há um novo `push` (ou merge) na branch configurada como produção.

**O que acontece ao dar `git push`:**
1. O GitHub recebe o push e notifica a plataforma via webhook.
2. A plataforma (Vercel/Render) clona a versão mais recente do repositório.
3. Ela executa o **build** (no Angular: `npm install` + `ng build --configuration production`; na API: `npm install` + `prisma generate`).
4. Se o build for bem-sucedido, a nova versão é publicada automaticamente, substituindo a anterior.
5. No painel da plataforma, é possível acompanhar esse processo em tempo real — aparece o commit que disparou o deploy, os logs de build e, ao final, o status **"Deploy concluído" / "Live"**.

---
---

# Backend

## Como a API rodava localmente

A API foi desenvolvida com **Express + Prisma + MySQL**, seguindo arquitetura MVC. Em desenvolvimento, o servidor era iniciado com **Nodemon**, que reinicia automaticamente o processo a cada alteração nos arquivos:

```bash
npm run dev
# equivalente a: nodemon src/server.js
```

### Variáveis do `.env` local

O arquivo `.env` (nunca commitado, presente no `.gitignore`) continha as seguintes chaves:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
NODE_ENV=
```

## Escolha da plataforma

Para a hospedagem da API, optei pelo **Render** pelos seguintes motivos:

- possui um **plano gratuito** suficiente para o escopo do projeto acadêmico;
- suporte nativo a aplicações **Node.js**, com deploy automático a partir do GitHub;
- permite configurar **variáveis de ambiente** diretamente no painel, sem expor segredos no código;
- exibe **logs em tempo real** do build e da execução, o que facilita identificar erros de configuração (ex: variável de ambiente faltando, falha de conexão com o banco);
- integra bem com bancos MySQL hospedados externamente.

---

## Deploy da API — passo a passo

1. **Criação do serviço:** acessei o painel da plataforma, escolhi "New Web Service" e conectei minha conta do GitHub.
2. **Seleção do repositório:** selecionei o repositório `underground-wiki-api` (branch `main`), que a plataforma passou a monitorar via webhook.
3. **Configuração do build e start:**
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** a plataforma lê o script `start` do `package.json`:
     ```json
     "scripts": {
       "start": "node src/server.js"
     }
     ```
  **Variáveis de ambiente:** na aba *Environment* do serviço, adicionei manualmente cada chave que existia no `.env` local:

   | Chave | Onde é usada |
   |-------|--------------|
   | `DATABASE_URL` | conexão do Prisma com o banco MySQL hospedado |
   | `JWT_SECRET` | assinatura e validação dos tokens JWT |
   | `JWT_EXPIRES_IN` | tempo de expiração do token |
   | `PORT` | porta em que o Express escuta (a plataforma geralmente define automaticamente) |
   | `NODE_ENV` | define o ambiente como `production` |

 **Migrations do banco:** executei `npx prisma migrate deploy` (via shell da plataforma ou como parte do build) para aplicar as migrations no banco de produção.
 **Deploy automático:** a cada `git push` na branch `main`, a plataforma detecta o novo commit, refaz o build e publica a nova versão automaticamente.

---

## Conexão da API ao banco hospedado

**`DATABASE_URL` em produção:** essa variável segue o formato `mysql://usuario:senha@host:porta/nome_do_banco`. Em produção, o `host`, `usuario`, `senha` e `nome_do_banco` correspondem ao banco MySQL hospedado (e não mais ao `localhost` usado em desenvolvimento). O Prisma lê essa variável em tempo de execução (`schema.prisma` → `env("DATABASE_URL")`) e usa esses dados para abrir a conexão TCP com o banco remoto.

**Por que as variáveis da plataforma substituem o `.env` local:** o arquivo `.env` nunca é enviado ao GitHub (está no `.gitignore`), então ele simplesmente **não existe** no ambiente de produção. A plataforma de hospedagem injeta as variáveis configuradas no painel diretamente no `process.env` do container em que a API roda — funcionando exatamente como o `.env` funcionava localmente, mas de forma segura e sem expor credenciais no código-fonte.

**O que aconteceria se o `DATABASE_URL` estivesse errado:**
- o Prisma não conseguiria abrir a conexão com o banco;
- qualquer rota que dependa do banco (ex: `GET /api/artists`, `POST /api/auth/login`) lançaria um erro no `try/catch` do controller;
- como os controllers tratam esses erros, a API retornaria um **status `500 Internal Server Error`** com uma mensagem genérica (ex: `{ "error": "Erro ao listar artistas" }`), e os logs da plataforma mostrariam o erro real do Prisma (ex: `Can't reach database server` ou `Access denied for user`).
---

## Tecnologias utilizadas

**Front-end:** Angular 17, TypeScript, SCSS, RxJS
**Back-end:** Node.js, Express, Prisma, MySQL, JWT, bcrypt
**Hospedagem:** Vercel (front-end) · Render (API) · Banco MySQL hospedado
**Versionamento:** Git + GitHub (repositórios separados, deploy automático via webhook)
