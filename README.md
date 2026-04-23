# TaskFlow 🗂️

Sistema completo de gerenciamento de tarefas para equipes — inspirado no ClickUp, com suporte a PWA (instalável como app).

## Funcionalidades

- **Kanban** com drag & drop, WIP limits, colunas customizáveis
- **Tarefas detalhadas** — descrição, responsáveis, prioridade, prazo, subtarefas, comentários
- **Time tracking** — cronômetro e registro manual de horas
- **Membros do time** — carga de trabalho, métricas e progresso do sprint
- **Relatórios** — gráficos de produtividade, horas, categorias e eficiência
- **Automações** — regras if/then configuráveis
- **PWA** — instale como aplicativo no desktop ou celular
- **Offline** — dados salvos localmente, funciona sem internet
- **Tema claro/escuro**

## Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/taskflow.git
cd taskflow

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev

# Gere o build de produção
npm run build
```

## Deploy no GitHub Pages (gratuito)

1. Faça o build: `npm run build`
2. Instale o gh-pages: `npm install -D gh-pages`
3. Adicione ao `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
4. Execute: `npm run deploy`
5. Acesse: `https://SEU_USUARIO.github.io/taskflow`

## Instalar como aplicativo (PWA)

Após abrir no navegador (Chrome/Edge):
- **Desktop**: clique no ícone de instalação na barra de endereços
- **Android**: menu → "Adicionar à tela inicial"
- **iOS (Safari)**: compartilhar → "Adicionar à tela de início"

## Stack

| Camada     | Tecnologia           |
|------------|----------------------|
| Frontend   | React 18 + Vite 5    |
| Estado     | Zustand (persisted)  |
| PWA        | vite-plugin-pwa      |
| Ícones     | lucide-react         |
| Dados      | localStorage         |
| Deploy     | GitHub Pages / Vercel|

## Estrutura do projeto

```
src/
├── components/
│   ├── Board/        # Kanban com drag & drop
│   ├── Members/      # Gestão do time
│   ├── Modals/       # TaskModal, AddTaskModal
│   ├── Reports/      # Dashboards e gráficos
│   ├── Sidebar/      # Navegação e topbar
│   └── UI/           # Automações e utilitários
├── store/            # Estado global (Zustand)
├── App.jsx
├── main.jsx
└── index.css
```

## Roadmap

- [ ] Backend com Node.js + PostgreSQL
- [ ] Autenticação (JWT)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Integração com Slack / Google Drive
- [ ] Visualização Gantt e Calendário
- [ ] API aberta com documentação Swagger
- [ ] App mobile nativo (React Native)

## Licença

MIT
