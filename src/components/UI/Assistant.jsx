import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store'

const KNOWLEDGE = {
  github: `**Como subir no GitHub & fazer deploy**

**1. Criar o repositório:**
\`\`\`
git init
git add .
git commit -m "feat: TaskFlow"
gh repo create taskflow --public
git push -u origin main
\`\`\`

**2. Ativar GitHub Pages:**
Settings → Pages → Source: **GitHub Actions**. O arquivo \`.github/workflows/deploy.yml\` já está configurado — o deploy roda automaticamente a cada push na branch \`main\`.

**3. Acessar o app:**
\`https://SEU_USUARIO.github.io/taskflow\`

Demora ~2 minutos na primeira vez.`,

  pwa: `**Instalar como aplicativo (PWA)**

O TaskFlow já vem com suporte a PWA configurado via \`vite-plugin-pwa\`.

**Desktop (Chrome / Edge):**
Abra o link → clique no ícone ➕ na barra de endereços → "Instalar TaskFlow".

**Android (Chrome):**
Menu (⋮) → "Adicionar à tela inicial".

**iOS (Safari):**
Compartilhar (□↑) → "Adicionar à tela de início".

O app aparece na home screen como qualquer outro aplicativo e **funciona offline** — os dados ficam no \`localStorage\` e o Service Worker armazena assets em cache.`,

  trello: `**Migrar dados do Trello**

**Passo 1 — Exportar do Trello:**
Abra o quadro → Menu (…) → Mais → Imprimir e Exportar → **Exportar como JSON**

**Passo 2 — Importar no TaskFlow:**
No menu lateral → "Importar Trello" → arraste o arquivo .json ou clique para selecionar.

**O que é migrado automaticamente:**
- Listas → Colunas do Kanban
- Cards → Tarefas
- Checklists → Subtarefas
- Etiquetas/cores → Categorias (Design, Dev, Bug, Conteúdo)
- Datas de vencimento → Prazo
- Descrição → Descrição da tarefa

Colunas que não têm correspondência exata são criadas automaticamente.`,

  features: `**Funcionalidades do TaskFlow**

**Kanban:** drag & drop entre colunas, WIP limits por coluna, colunas personalizáveis, filtros por categoria e prioridade, busca em tempo real.

**Tarefas:** título, descrição rica, categoria, prioridade (alta/média/baixa), múltiplos responsáveis, subtarefas com checklist, comentários, prazo e estimativa de horas.

**Time Tracking:** cronômetro integrado por tarefa, registro manual de horas, barra de progresso visual, relatório de eficiência.

**Membros:** cards individuais com métricas de tarefas e horas, progresso por sprint, indicador de tarefas atrasadas.

**Relatórios:** tarefas por membro, horas estimadas vs registradas, distribuição por categoria e coluna, eficiência de tempo.

**Automações:** regras if/then configuráveis — ao concluir, prazo próximo, alta prioridade criada.`,

  backend: `**Evoluir para backend real**

O TaskFlow atual usa \`localStorage\`. Para escalar para um time real com múltiplos usuários:

**Stack recomendada:**
\`\`\`
Frontend:  React + Vite (já pronto)
Backend:   Node.js + Express
Database:  PostgreSQL
Auth:      JWT + bcrypt
Realtime:  Socket.io (notificações)
Deploy:    Railway / Render / Fly.io
\`\`\`

**Próximos passos:**
1. Criar API REST com Express (\`/tasks\`, \`/members\`, \`/columns\`)
2. Substituir o Zustand store por chamadas à API
3. Adicionar autenticação com JWT
4. WebSocket para atualizações em tempo real
5. Upload de anexos via S3 / Cloudflare R2`,

  geral: `Olá! Sou o **assistente do TaskFlow**. Posso te ajudar com:

- Como rodar e fazer **deploy no GitHub Pages**
- Instalar como **app (PWA)** no celular ou desktop
- **Migrar dados do Trello** para o TaskFlow
- Entender as **funcionalidades** do sistema
- Evoluir para **backend** com banco de dados real

Selecione um tópico no menu lateral ou escreva sua pergunta!`,
}

const SUGGESTIONS = {
  geral:    ['Como instalo o projeto?', 'Como faço o deploy?', 'Como instalar como app?', 'Quais funcionalidades tem?'],
  github:   ['Como configuro GitHub Pages?', 'Posso usar Vercel?', 'Como atualizo o deploy?', 'Preciso de servidor pago?'],
  pwa:      ['Como instalo no iPhone?', 'Funciona offline?', 'Como atualizar o app?', 'É igual app da loja?'],
  trello:   ['O que é migrado?', 'Como exporto do Trello?', 'Colunas personalizadas funcionam?', 'Posso importar vários quadros?'],
  features: ['Como funciona o drag & drop?', 'O que é WIP limit?', 'Como faço time tracking?', 'Como funcionam as automações?'],
  backend:  ['Como adiciono banco de dados?', 'Como faço autenticação?', 'Qual stack recomenda?', 'Como escalo para um time maior?'],
}

const QUICK_ANSWERS = {
  'como instalo o projeto':      'Para instalar localmente:\n\n```\nnpm install\nnpm run dev\n```\n\nO servidor abre em `http://localhost:5173`.',
  'como faço o deploy':          KNOWLEDGE.github,
  'como instalar como app':      KNOWLEDGE.pwa,
  'quais funcionalidades tem':   KNOWLEDGE.features,
  'como configuro github pages': KNOWLEDGE.github,
  'posso usar vercel':           'Sim! O Vercel funciona perfeitamente. Conecte o repositório em vercel.com — ele detecta o Vite automaticamente. Deploy também é gratuito.',
  'preciso de servidor pago':    'Não! O **GitHub Pages é 100% gratuito** para repositórios públicos. Basta ativar em Settings → Pages → GitHub Actions.',
  'como atualizo o deploy':      'Basta fazer `git push` para a branch `main`. O GitHub Actions detecta e faz o deploy automaticamente em ~2 minutos.',
  'como instalo no iphone':      'No iPhone: Safari → acesse o link → Compartilhar (□↑) → "Adicionar à tela de início". O ícone aparece na home screen.',
  'funciona offline':            'Sim! O Service Worker armazena os assets em cache e os dados ficam no `localStorage`. Funciona sem conexão.',
  'o que é migrado':             KNOWLEDGE.trello,
  'como exporto do trello':      'No Trello: abra o quadro → Menu (…) → Mais → Imprimir e Exportar → **Exportar como JSON**.',
  'colunas personalizadas funcionam': 'Sim! Colunas que não têm correspondência (To Do, Doing, Done) são criadas automaticamente com cor roxa. Você pode renomear depois.',
  'como funciona o drag & drop': 'Clique e arraste qualquer card para outra coluna. O sistema verifica os WIP limits — se a coluna estiver cheia, exibe um alerta e bloqueia a movimentação.',
  'o que é wip limit':           'WIP (Work In Progress) limit é o número máximo de tarefas permitidas em uma coluna. Por padrão: "Em Progresso" aceita até 5 e "Revisão" até 3. Clique no número da coluna para editar.',
  'como faço time tracking':     'Em cada card há um botão **▶ Iniciar**. Clique para iniciar o cronômetro. Para parar: ⏹ Parar. Você também pode registrar horas manualmente: abra o card → aba **Tempo**.',
  'como funcionam as automações':'São regras **if/then** configuráveis. Exemplo: "Quando tarefa for concluída → notificar responsável". Acesse o menu **Automações** para ativar/desativar ou criar novas regras.',
  'como adiciono banco de dados': KNOWLEDGE.backend,
  'como escalo para um time maior': KNOWLEDGE.backend,
  'qual stack recomenda':        KNOWLEDGE.backend,
}

function getAnswer(question, topic) {
  const q = question.toLowerCase().trim()
  for (const [key, answer] of Object.entries(QUICK_ANSWERS)) {
    if (q.includes(key)) return answer
  }
  if (q.match(/oi|olá|ola|bom dia|boa tarde|boa noite|hey|hello/)) return 'Olá! 👋 Sou o assistente do **TaskFlow**. Posso te ajudar com deploy, PWA, migração do Trello, funcionalidades e backend. O que você precisa?'
  if (q.match(/obrigad|valeu|thank/)) return 'De nada! Se tiver mais dúvidas sobre o TaskFlow é só perguntar. 😊'
  if (q.match(/trello|import|migr/)) return KNOWLEDGE.trello
  if (q.match(/github|deploy|pages|vercel/)) return KNOWLEDGE.github
  if (q.match(/pwa|app|celular|offline|instalar|instalo/)) return KNOWLEDGE.pwa
  if (q.match(/backend|banco|database|api|node|servidor|escal/)) return KNOWLEDGE.backend
  if (q.match(/funcionalidade|feature|kanban|recurso|wip|drag|task/)) return KNOWLEDGE.features
  return KNOWLEDGE[topic] || 'Não encontrei uma resposta específica para isso, mas posso ajudar com: **Deploy**, **PWA**, **Trello**, **Funcionalidades** ou **Backend**. Use as sugestões abaixo ou pergunte livremente!'
}

function formatText(text) {
  const parts = []
  const codeRegex = /```([\s\S]*?)```/g
  let last = 0, match
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) })
    parts.push({ type: 'code', content: match[1] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })

  return parts.map((p, i) => {
    if (p.type === 'code') return (
      <pre key={i} style={{ background: 'var(--bg0)', borderRadius: 7, padding: '9px 11px', fontFamily: 'monospace', fontSize: 10.5, color: '#a3e635', margin: '6px 0', border: '1px solid var(--bd)', overflowX: 'auto', whiteSpace: 'pre' }}>
        {p.content}
      </pre>
    )
    const html = p.content
      .replace(/`([^`]+)`/g, '<span style="background:var(--bg3);border-radius:4px;padding:1px 5px;font-family:monospace;font-size:11px;color:#a3e635;border:1px solid var(--bd)">$1</span>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n- /g, '<br>• ')
      .replace(/\n/g, '<br>')
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

const TOPICS = [
  { id: 'geral',    label: 'Geral',           icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { id: 'github',   label: 'GitHub & Deploy',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg> },
  { id: 'pwa',      label: 'PWA / App',        icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { id: 'trello',   label: 'Migração Trello',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="6" height="13" rx="1"/><rect x="10" y="3" width="6" height="8" rx="1"/><rect x="18" y="3" width="4" height="10" rx="1"/></svg> },
  { id: 'features', label: 'Funcionalidades',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'backend',  label: 'Backend / API',    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
]

export default function Assistant() {
  const { tasks, members }    = useStore()
  const [msgs, setMsgs]       = useState([{ role: 'bot', text: KNOWLEDGE.geral, time: now() }])
  const [input, setInput]     = useState('')
  const [topic, setTopic]     = useState('geral')
  const [typing, setTyping]   = useState(false)
  const [busy, setBusy]       = useState(false)
  const msgsRef               = useRef(null)
  const inputRef              = useRef(null)

  function now() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs, typing])

  const send = async () => {
    if (busy || !input.trim()) return
    const text = input.trim()
    setInput('')
    setBusy(true)
    setMsgs(m => [...m, { role: 'user', text, time: now() }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 500 + Math.random() * 700))
    setTyping(false)
    const answer = getAnswer(text, topic)
    setMsgs(m => [...m, { role: 'bot', text: answer, time: now() }])
    setBusy(false)
    inputRef.current?.focus()
  }

  const changeTopic = (t) => {
    setTopic(t)
    setMsgs(m => [...m, { role: 'bot', text: KNOWLEDGE[t], time: now() }])
  }

  const clearChat = () => setMsgs([{ role: 'bot', text: 'Conversa reiniciada! Como posso te ajudar com o TaskFlow?', time: now() }])

  const ni = (t, active, onClick) => (
    <button key={t.id} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px',
      margin: '1px 0', borderRadius: 7, width: '100%', fontSize: 11, fontWeight: 500,
      color: active ? '#fca5a5' : 'var(--tx3)',
      background: active ? 'rgba(233,69,96,.12)' : 'transparent',
      border: 'none', cursor: 'pointer', transition: 'all .12s', textAlign: 'left',
    }}>
      {t.icon}
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
    </button>
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left panel */}
      <div style={{ width: 200, background: 'var(--bg1)', borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px', borderBottom: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#e94560,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>T</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>TaskFlow AI</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Assistente inteligente</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '7px 5px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 8.5, letterSpacing: '1.2px', color: 'var(--tx3)', padding: '9px 7px 3px', textTransform: 'uppercase' }}>Tópicos</div>
          {TOPICS.map(t => ni(t, topic === t.id, () => changeTopic(t.id)))}

          <div style={{ fontSize: 8.5, letterSpacing: '1.2px', color: 'var(--tx3)', padding: '12px 7px 4px', textTransform: 'uppercase' }}>Contexto do time</div>
          <div style={{ padding: '8px 9px', background: 'var(--s1)', borderRadius: 8, margin: '2px 4px', border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 5 }}>Sprint atual</div>
            {[
              { label: 'Tarefas',   val: tasks.length,                              color: 'var(--tx2)' },
              { label: 'Concluídas',val: tasks.filter(t => t.col === 'done').length, color: '#4ade80' },
              { label: 'Membros',   val: members.length,                            color: '#60a5fa' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: s.color }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '9px 8px', borderTop: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulse 2s infinite' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 500 }}>Assistente online</div>
            <div style={{ fontSize: 8.5, color: 'var(--tx3)' }}>Claude Sonnet</div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat topbar */}
        <div style={{ background: 'var(--bg1)', borderBottom: '1px solid var(--bd)', padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#e94560,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>T</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Assistente TaskFlow</div>
            <div style={{ fontSize: 9, background: 'rgba(34,197,94,.12)', color: '#4ade80', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Online</div>
          </div>
          <button onClick={clearChat} title="Limpar conversa" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx3)', lineHeight: 0, padding: 4, borderRadius: 5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} className="fade-up" style={{ display: 'flex', gap: 10, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: m.role === 'user' ? '80%' : '88%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 27, height: 27, borderRadius: '50%', background: m.role === 'bot' ? 'var(--ac)' : '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: 2 }}>
                {m.role === 'bot' ? 'T' : 'U'}
              </div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--tx3)', marginBottom: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  {m.role === 'bot' ? 'TaskFlow AI' : 'Você'}
                </div>
                <div style={{
                  padding: '9px 12px', borderRadius: m.role === 'bot' ? '4px 11px 11px 11px' : '11px 4px 11px 11px',
                  background: m.role === 'bot' ? 'var(--bg2)' : 'var(--ac)',
                  border: m.role === 'bot' ? '1px solid var(--bd)' : 'none',
                  color: m.role === 'bot' ? 'var(--tx)' : '#fff',
                  fontSize: 12, lineHeight: 1.65,
                }}>
                  {formatText(m.text)}
                </div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', gap: 10, maxWidth: '88%' }}>
              <div style={{ width: 27, height: 27, borderRadius: '50%', background: 'var(--ac)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: 2 }}>T</div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--tx3)', marginBottom: 3 }}>TaskFlow AI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 13px', background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '4px 11px 11px 11px' }}>
                  {[0, 150, 300].map(d => (
                    <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tx3)', animation: `bounce .8s ${d}ms infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 14px 8px' }}>
          {(SUGGESTIONS[topic] || []).map(s => (
            <button key={s} onClick={() => { setInput(s); setTimeout(send, 50) }} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--bd)', color: 'var(--tx2)', background: 'var(--s1)', cursor: 'pointer', transition: 'all .12s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(233,69,96,.4)'; e.currentTarget.style.color = 'var(--ac)'; e.currentTarget.style.background = 'rgba(233,69,96,.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.color = 'var(--tx2)'; e.currentTarget.style.background = 'var(--s1)' }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '10px 14px', background: 'var(--bg1)', borderTop: '1px solid var(--bd)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: '8px 10px' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Pergunte sobre deploy, PWA, Trello, funcionalidades..."
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--tx)', fontSize: 12, fontFamily: 'var(--fn)', resize: 'none', maxHeight: 110, lineHeight: 1.55, padding: '2px 0' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px' }}
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ac)', border: 'none', cursor: busy ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: busy || !input.trim() ? .4 : 1, transition: 'opacity .12s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', padding: '4px 4px 0', textAlign: 'right' }}>Enter para enviar · Shift+Enter nova linha</div>
        </div>
      </div>
    </div>
  )
}
