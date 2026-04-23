import { useState } from 'react'
import { useStore } from '../../store'

const TAG_MAP = {
  purple: 'design', blue: 'dev', red: 'bug',
  green: 'content', orange: 'content', yellow: 'content',
  sky: 'dev', lime: 'content', pink: 'design', black: 'bug',
}

const COL_MAP = {
  'To Do': 'todo', 'Todo': 'todo', 'A Fazer': 'todo', 'Backlog': 'todo',
  'Doing': 'progress', 'In Progress': 'progress', 'Em Andamento': 'progress', 'Fazendo': 'progress',
  'Review': 'review', 'Revisão': 'review', 'Testing': 'review',
  'Done': 'done', 'Concluído': 'done', 'Completed': 'done',
}

export default function TrelloImport() {
  const { tasks: storeTasks, addTask, addColumn, columns } = useStore()
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview]   = useState(null)
  const [imported, setImported] = useState(false)

  const parse = (data) => {
    const listMap = {}
    const newCols = []

    data.lists?.filter(l => !l.closed).forEach(l => {
      const colId = COL_MAP[l.name]
      if (colId) {
        listMap[l.id] = colId
      } else {
        const id = 'col_trello_' + l.id
        listMap[l.id] = id
        if (!columns.find(c => c.id === id)) {
          newCols.push({ id, label: l.name, color: '#a78bfa', wip: null })
        }
      }
    })

    const cards = data.cards?.filter(c => !c.closed) || []
    const parsed = cards.map(card => {
      const label   = card.labels?.[0]
      const tag     = label ? (TAG_MAP[label.color] || 'dev') : 'dev'
      const subs    = []
      card.checklists?.forEach(cl => {
        cl.checkItems?.forEach(ci => {
          subs.push({ id: 's_' + ci.id, title: ci.name, done: ci.state === 'complete' })
        })
      })
      return {
        title:    card.name,
        desc:     card.desc || '',
        tag,
        priority: 'medium',
        members:  [],
        col:      listMap[card.idList] || 'todo',
        est:      2,
        date:     card.due ? card.due.split('T')[0] : '',
        _subs:    subs,
      }
    })

    return { parsed, newCols, boardName: data.name }
  }

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.json')) {
      alert('Por favor, selecione um arquivo .json exportado do Trello.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const result = parse(data)
        setPreview(result)
        setImported(false)
      } catch {
        alert('Arquivo inválido. Use o JSON exportado pelo Trello (Menu → Mais → Imprimir e Exportar → JSON).')
      }
    }
    reader.readAsText(file)
  }

  const loadSample = () => {
    const sample = {
      name: 'Projeto de Exemplo (Trello)',
      lists: [
        { id: 'l1', name: 'To Do',   closed: false },
        { id: 'l2', name: 'Doing',   closed: false },
        { id: 'l3', name: 'Review',  closed: false },
        { id: 'l4', name: 'Done',    closed: false },
      ],
      cards: [
        { id: 'c1', name: 'Criar landing page', desc: 'Design e dev da LP do produto.', idList: 'l1', due: '2026-04-30', idMembers: [], labels: [{ color: 'purple', name: 'Design' }], checklists: [{ name: 'Tarefas', checkItems: [{ id: 'ci1', name: 'Wireframe', state: 'complete' }, { id: 'ci2', name: 'Desenvolver', state: 'incomplete' }] }], closed: false },
        { id: 'c2', name: 'Integrar API de pagamento', desc: 'Stripe — checkout e webhooks.', idList: 'l2', due: '2026-04-22', idMembers: [], labels: [{ color: 'blue', name: 'Dev' }], checklists: [], closed: false },
        { id: 'c3', name: 'Escrever documentação', desc: '', idList: 'l1', due: '', idMembers: [], labels: [{ color: 'green', name: 'Conteúdo' }], checklists: [], closed: false },
        { id: 'c4', name: 'Configurar CI/CD', desc: 'GitHub Actions para build e deploy.', idList: 'l4', due: '2026-04-15', idMembers: [], labels: [{ color: 'blue', name: 'Dev' }], checklists: [], closed: false },
        { id: 'c5', name: 'Bug: login OAuth', desc: 'Google OAuth retorna 401 em produção.', idList: 'l3', due: '2026-04-19', idMembers: [], labels: [{ color: 'red', name: 'Bug' }], checklists: [], closed: false },
        { id: 'c6', name: 'Posts para lançamento', desc: '10 posts Instagram/LinkedIn.', idList: 'l1', due: '2026-04-25', idMembers: [], labels: [{ color: 'green', name: 'Conteúdo' }], checklists: [], closed: false },
      ],
      members: [],
    }
    const result = parse(sample)
    setPreview(result)
    setImported(false)
  }

  const confirmImport = () => {
    if (!preview) return
    preview.newCols.forEach(col => addColumn(col.label))
    preview.parsed.forEach(task => {
      addTask({
        title:    task.title,
        desc:     task.desc,
        tag:      task.tag,
        priority: task.priority,
        members:  task.members,
        col:      task.col,
        est:      task.est,
        date:     task.date,
      })
      // attach subtasks via store after add
    })
    setImported(true)
  }

  const step = (n, text) => (
    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--s1)', borderRadius: 8, border: '1px solid var(--bd)', marginBottom: 7 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,121,191,.2)', color: '#4db8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{n}</div>
      <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{text}</span>
    </div>
  )

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: 540, width: '100%' }}>
        {/* Header */}
        <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '26px 24px', border: '1px solid var(--bd)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,121,191,.15)', border: '1px solid rgba(0,121,191,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0079bf" strokeWidth="1.8"><rect x="2" y="3" width="6" height="13" rx="1"/><rect x="10" y="3" width="6" height="8" rx="1"/><rect x="18" y="3" width="4" height="10" rx="1"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Importar do Trello</div>
              <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>Migre listas, cards, checklists e etiquetas automaticamente.</div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--tx3)', marginBottom: 9 }}>Como exportar do Trello</div>
            {[
              ['1', 'Abra o quadro no Trello'],
              ['2', 'Menu (…) → Mais → Imprimir e Exportar'],
              ['3', 'Clique em "Exportar como JSON"'],
              ['4', 'Salve o arquivo e importe abaixo'],
            ].map(([n, t]) => step(n, t))}
          </div>

          {/* Drop zone */}
          <div
            onClick={() => document.getElementById('trello-file-input').click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: `2px dashed ${dragging ? '#0079bf' : 'rgba(0,121,191,.3)'}`,
              borderRadius: 10, padding: '22px', textAlign: 'center',
              background: dragging ? 'rgba(0,121,191,.09)' : 'rgba(0,121,191,.04)',
              cursor: 'pointer', transition: 'all .15s', marginBottom: 12,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4db8ff" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4db8ff', marginBottom: 3 }}>Arraste o arquivo JSON aqui</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>ou clique para selecionar</div>
            <input
              id="trello-file-input"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>ou teste com dados de exemplo</span>
            <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
          </div>

          <button
            onClick={loadSample}
            style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px solid rgba(0,121,191,.3)', background: 'rgba(0,121,191,.08)', color: '#4db8ff', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .12s' }}
          >
            ▶ Carregar exemplo de quadro Trello
          </button>
        </div>

        {/* Preview */}
        {preview && (
          <div className="fade-up" style={{ background: 'var(--bg2)', borderRadius: 12, padding: '16px 18px', border: `1px solid ${imported ? 'rgba(34,197,94,.25)' : 'var(--bd)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {imported ? '✅ Importação concluída!' : `📋 ${preview.boardName}`}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                  {preview.parsed.length} card{preview.parsed.length !== 1 ? 's' : ''} encontrado{preview.parsed.length !== 1 ? 's' : ''}
                  {preview.newCols.length > 0 && ` · ${preview.newCols.length} nova${preview.newCols.length !== 1 ? 's' : ''} coluna${preview.newCols.length !== 1 ? 's' : ''}`}
                </div>
              </div>
              {!imported && (
                <button onClick={confirmImport} style={{ padding: '7px 16px', borderRadius: 8, background: '#22c55e', color: '#fff', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Confirmar importação
                </button>
              )}
            </div>

            {/* Card previews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: imported ? 12 : 0 }}>
              {preview.parsed.slice(0, 5).map((t, i) => {
                const TAG_STYLE = { design: { bg: 'rgba(139,92,246,.18)', color: '#a78bfa' }, dev: { bg: 'rgba(59,130,246,.18)', color: '#60a5fa' }, bug: { bg: 'rgba(239,68,68,.18)', color: '#f87171' }, content: { bg: 'rgba(34,197,94,.18)', color: '#4ade80' } }
                const TAG_LABEL = { design: 'Design', dev: 'Dev', bug: 'Bug', content: 'Conteúdo' }
                const col = { todo: { l: 'A Fazer', c: '#64748b' }, progress: { l: 'Em Progresso', c: '#f59e0b' }, review: { l: 'Revisão', c: '#60a5fa' }, done: { l: 'Concluído', c: '#22c55e' } }[t.col] || { l: t.col, c: '#a78bfa' }
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', background: 'var(--s1)', borderRadius: 7, border: '1px solid var(--bd)' }}>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, fontWeight: 700, background: TAG_STYLE[t.tag]?.bg, color: TAG_STYLE[t.tag]?.color, flexShrink: 0 }}>{TAG_LABEL[t.tag]}</span>
                    <span style={{ fontSize: 11, color: 'var(--tx2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    <span style={{ fontSize: 9, color: col.c, flexShrink: 0 }}>{col.l}</span>
                  </div>
                )
              })}
              {preview.parsed.length > 5 && (
                <div style={{ fontSize: 10, color: 'var(--tx3)', textAlign: 'center', padding: '4px 0' }}>
                  + {preview.parsed.length - 5} cards adicionais
                </div>
              )}
            </div>

            {imported && (
              <button
                onClick={() => useStore.getState().setView('board')}
                style={{ width: '100%', padding: '9px', borderRadius: 8, background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.2)', color: '#4ade80', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Ver no Quadro →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
