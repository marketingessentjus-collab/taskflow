import { useStore } from '../../store'

const TAG_STYLE = {
  design:  { bg:'rgba(139,92,246,.18)', color:'#a78bfa' },
  dev:     { bg:'rgba(59,130,246,.18)',  color:'#60a5fa' },
  bug:     { bg:'rgba(239,68,68,.18)',   color:'#f87171' },
  content: { bg:'rgba(34,197,94,.18)',   color:'#4ade80' },
}
const TAG_LABEL  = { design:'Design', dev:'Dev', bug:'Bug', content:'Conteúdo' }
const PRIO_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#22c55e' }
const PRIO_LABEL = { high:'Alta', medium:'Média', low:'Baixa' }
const TODAY      = new Date().toISOString().split('T')[0]

export default function ListView({ onOpenTask }) {
  const { columns, members, filteredTasks } = useStore()
  const tasks = filteredTasks()

  return (
    <div style={{ padding: 14, overflowY: 'auto', height: '100%' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', marginBottom: 6, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--tx3)' }}>
        <span style={{ width: 5, flexShrink: 0 }} />
        <span style={{ width: 75, flexShrink: 0 }}>Categoria</span>
        <span style={{ flex: 1 }}>Tarefa</span>
        <span style={{ width: 100, textAlign: 'center', flexShrink: 0 }}>Status</span>
        <span style={{ width: 60, textAlign: 'center', flexShrink: 0 }}>Responsável</span>
        <span style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>Prazo</span>
        <span style={{ width: 70, textAlign: 'right', flexShrink: 0 }}>Tempo</span>
      </div>

      {tasks.map((task, i) => {
        const col       = columns.find(c => c.id === task.col)
        const assignees = members.filter(m => task.members.includes(m.id))
        const overdue   = task.date && task.date < TODAY && task.col !== 'done'
        const pct       = task.est === 0 ? 0 : Math.min(100, Math.round(task.logged / task.est * 100))

        return (
          <div
            key={task.id}
            className="fade-up"
            onClick={() => onOpenTask(task.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', background: 'var(--bg2)',
              borderRadius: 8, marginBottom: 4,
              border: `1px solid ${overdue ? 'rgba(239,68,68,.2)' : 'var(--bd)'}`,
              cursor: 'pointer', transition: 'border-color .12s',
              animationDelay: `${i * 0.02}s`,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--bd2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = overdue ? 'rgba(239,68,68,.2)' : 'var(--bd)'}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: PRIO_COLOR[task.priority], flexShrink: 0 }} />
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 12, fontWeight: 700, background: TAG_STYLE[task.tag]?.bg, color: TAG_STYLE[task.tag]?.color, width: 75, textAlign: 'center', flexShrink: 0 }}>
              {TAG_LABEL[task.tag]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
              <div style={{ height: 2, background: 'var(--s2)', borderRadius: 1, marginTop: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: col?.color || '#64748b', borderRadius: 1 }} />
              </div>
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 600, background: 'var(--s2)', color: col?.color, width: 100, textAlign: 'center', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {col?.label || '—'}
            </span>
            <div style={{ display: 'flex', width: 60, justifyContent: 'center', flexShrink: 0 }}>
              {assignees.slice(0, 3).map((m, i) => (
                <div key={m.id} style={{ width: 20, height: 20, borderRadius: '50%', background: m.color, border: '2px solid var(--bg2)', marginLeft: i === 0 ? 0 : -6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }} title={m.name}>
                  {m.initials}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 10, color: overdue ? '#f87171' : 'var(--tx3)', width: 80, textAlign: 'right', flexShrink: 0 }}>
              {task.date || '—'}
            </span>
            <span style={{ fontSize: 10, color: 'var(--tx3)', width: 70, textAlign: 'right', flexShrink: 0 }}>
              {task.logged}h / {task.est}h
            </span>
          </div>
        )
      })}

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--tx3)', fontSize: 13 }}>
          Nenhuma tarefa encontrada
        </div>
      )}
    </div>
  )
}
