import { useState } from 'react'
import { useStore } from '../../store'

const TAG_STYLE = {
  design:  { bg: 'rgba(139,92,246,.18)', color: '#a78bfa' },
  dev:     { bg: 'rgba(59,130,246,.18)',  color: '#60a5fa' },
  bug:     { bg: 'rgba(239,68,68,.18)',   color: '#f87171' },
  content: { bg: 'rgba(34,197,94,.18)',   color: '#4ade80' },
}
const TAG_LABEL   = { design: 'Design', dev: 'Dev', bug: 'Bug', content: 'Conteúdo' }
const PRIO_COLOR  = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
const TODAY       = new Date().toISOString().split('T')[0]

function Card({ task, colColor, members, onOpen }) {
  const { timerActive, startTimer, stopTimer } = useStore()
  const assignees = members.filter(m => task.members.includes(m.id))
  const pct       = task.est === 0 ? 0 : Math.min(100, Math.round(task.logged / task.est * 100))
  const isRunning = timerActive === task.id
  const overdue   = task.date && task.date < TODAY && task.col !== 'done'

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('taskId', task.id); e.currentTarget.style.opacity = '.4' }}
      onDragEnd={e   => { e.currentTarget.style.opacity = '1' }}
      onClick={() => onOpen(task.id)}
      className="fade-up"
      style={{
        background: 'var(--bg4)', borderRadius: 9, padding: '10px 11px', marginBottom: 7,
        border: `1px solid ${overdue ? 'rgba(239,68,68,.3)' : 'var(--bd)'}`,
        cursor: 'grab', userSelect: 'none', transition: 'border-color .12s, transform .1s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Title */}
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)', lineHeight: 1.4, marginBottom: 7 }}>{task.title}</div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 12, fontWeight: 700, background: TAG_STYLE[task.tag]?.bg, color: TAG_STYLE[task.tag]?.color }}>
          {TAG_LABEL[task.tag]}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: PRIO_COLOR[task.priority] }} />
          {overdue && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          )}
          <div style={{ display: 'flex' }}>
            {assignees.map((m, i) => (
              <div key={m.id} style={{ width: 17, height: 17, borderRadius: '50%', background: m.color, border: '1.5px solid var(--bg4)', marginLeft: i === 0 ? 0 : -4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: '#fff' }}>
                {m.initials}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 5 }}>
          ✓ {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtarefas
        </div>
      )}

      {/* Timer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 9, color: 'var(--tx3)' }}>⏱ {task.logged}h / {task.est}h</span>
        <button
          onClick={e => { e.stopPropagation(); isRunning ? stopTimer() : startTimer(task.id) }}
          style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: isRunning ? 'rgba(239,68,68,.12)' : 'var(--s2)', color: isRunning ? '#f87171' : 'var(--tx3)', border: `1px solid ${isRunning ? 'rgba(239,68,68,.25)' : 'var(--bd)'}`, fontWeight: 600 }}
        >
          {isRunning ? '⏹ parar' : '▶ iniciar'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 2, height: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: colColor, borderRadius: 2, transition: 'width .4s' }} />
      </div>

      {task.date && (
        <div style={{ fontSize: 9, color: overdue ? '#f87171' : 'var(--tx3)', marginTop: 4 }}>
          {overdue ? '⚠ Atrasada — ' : '📅 '}{task.date}
        </div>
      )}
    </div>
  )
}

export default function Board({ onOpenTask }) {
  const { columns, tasks, members, filteredTasks, moveTask, addTask, addColumn, updateColumn, deleteColumn } = useStore()
  const visible  = filteredTasks()
  const [dragOver, setDragOver] = useState(null)
  const [editingCol, setEditingCol] = useState(null)

  const handleDrop = (e, colId) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const ok = moveTask(taskId, colId)
    if (!ok) alert('Limite WIP atingido para esta coluna!')
    setDragOver(null)
  }

  const quickAdd = (colId) => {
    const title = window.prompt('Título da tarefa:')
    if (title?.trim()) addTask({ title: title.trim(), col: colId })
  }

  return (
    <div style={{ display: 'flex', gap: 11, overflowX: 'auto', overflowY: 'hidden', padding: 14, alignItems: 'flex-start', height: '100%' }}>
      {columns.map(col => {
        const colTasks = visible.filter(t => t.col === col.id)
        const wipHit   = col.wip && tasks.filter(t => t.col === col.id).length >= col.wip

        return (
          <div
            key={col.id}
            style={{
              width: 208, flexShrink: 0, display: 'flex', flexDirection: 'column',
              background: dragOver === col.id ? 'rgba(233,69,96,.06)' : 'var(--s1)',
              border: `1px solid ${dragOver === col.id ? 'rgba(233,69,96,.3)' : 'var(--bd)'}`,
              borderRadius: 11, maxHeight: 'calc(100vh - 145px)',
              transition: 'background .12s, border-color .12s',
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null) }}
            onDrop={e => handleDrop(e, col.id)}
          >
            {/* Header */}
            <div style={{ padding: '10px 10px 7px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
                {editingCol === col.id ? (
                  <input
                    autoFocus
                    defaultValue={col.label}
                    onBlur={e => { updateColumn(col.id, { label: e.target.value }); setEditingCol(null) }}
                    onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                    style={{ background: 'none', border: 'none', outline: 'none', fontSize: 10, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '.7px', width: 100 }}
                  />
                ) : (
                  <span onClick={() => setEditingCol(col.id)} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: col.color, cursor: 'text' }}>
                    {col.label}
                  </span>
                )}
                <span style={{ fontSize: 9, background: 'var(--s2)', padding: '2px 6px', borderRadius: 10, color: wipHit ? '#f87171' : 'var(--tx3)' }}>
                  {tasks.filter(t => t.col === col.id).length}{col.wip ? `/${col.wip}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                <button onClick={() => quickAdd(col.id)} style={{ color: 'var(--tx3)', lineHeight: 0, padding: 3, borderRadius: 4 }} title="Adicionar tarefa">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button onClick={() => window.confirm(`Deletar coluna "${col.label}"?`) && deleteColumn(col.id)} style={{ color: 'var(--tx3)', lineHeight: 0, padding: 3, borderRadius: 4 }} title="Mais opções">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </div>
            </div>

            {wipHit && (
              <div style={{ margin: '0 8px 6px', padding: '3px 8px', background: 'rgba(239,68,68,.1)', borderRadius: 6, fontSize: 9, color: '#f87171', textAlign: 'center' }}>
                Limite WIP atingido ({col.wip})
              </div>
            )}

            {/* Cards */}
            <div style={{ padding: '0 7px 6px', overflowY: 'auto', flex: 1 }}>
              {colTasks.map(task => (
                <Card key={task.id} task={task} colColor={col.color} members={members} onOpen={onOpenTask} />
              ))}
              {colTasks.length === 0 && dragOver !== col.id && (
                <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 11, color: 'var(--tx3)' }}>
                  Solte aqui
                </div>
              )}
            </div>

            <button
              onClick={() => quickAdd(col.id)}
              style={{ margin: '0 7px 7px', padding: 7, borderRadius: 7, border: '1px dashed var(--bd)', color: 'var(--tx3)', fontSize: 10, background: 'none', transition: 'all .12s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.color = 'var(--tx2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)';  e.currentTarget.style.color = 'var(--tx3)' }}
            >
              + cartão
            </button>
          </div>
        )
      })}

      <button
        onClick={() => { const n = window.prompt('Nome da nova coluna:'); if (n?.trim()) addColumn(n.trim()) }}
        style={{ width: 180, flexShrink: 0, padding: '10px', borderRadius: 11, border: '1px dashed var(--bd)', color: 'var(--tx3)', fontSize: 11, background: 'transparent', alignSelf: 'flex-start', transition: 'all .12s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.color = 'var(--tx2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--tx3)' }}
      >
        + nova coluna
      </button>
    </div>
  )
}
