🚀 DevTasks

Sistema fullstack de gerenciamento de tarefas para desenvolvedores, com autenticação local e login social via GitHub.

Frontend hospedado na Vercel
Backend hospedado na Render
Banco de dados: Neon (PostgreSQL serverless)

📸 Visão Geral

O DevTasks é uma aplicação moderna que permite:

✅ Criar, editar e deletar tarefas
🔐 Autenticação com JWT
🐙 Login com GitHub (OAuth 2.0)
👤 Gerenciamento de perfil
🛡️ Proteção de rotas no backend
🌍 Deploy em ambiente de produção

🏗️ Arquitetura
🔹 Frontend

React + Vite
TypeScript
React Router
Consumo de API REST
Tailwind CSS
shadcn/ui
Deploy: Vercel

🔹 Backend

Node.js
Express
TypeScript
PostgreSQL (Neon)
Passport (GitHub OAuth)
JWT
Deploy: Render

🔐 Autenticação

O sistema suporta dois métodos de autenticação:

1️⃣ Login Local

Email e senha
Hash com bcrypt
Token JWT com expiração de 7 dias

2️⃣ Login com GitHub

OAuth 2.0
Recuperação automática de email
Vinculação automática de conta
Geração de JWT após autenticação

🗄️ Banco de Dados

O projeto utiliza Neon, uma plataforma serverless baseada em PostgreSQL.

Estrutura principal:

users

dev_tasks

Relacionamento:

Cada tarefa pertence a um usuário (user_id)
As consultas são filtradas por usuário autenticado

📦 Estrutura do Projeto
```
devtasks/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── database/
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   └── context/
    │
    ├── vercel.json
    ├── package.json
    └── vite.config.ts
```
