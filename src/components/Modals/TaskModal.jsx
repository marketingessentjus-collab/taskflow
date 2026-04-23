import { useState } from 'react'
import { useStore } from '../../store'

const TAG_STYLE  = { design:{bg:'rgba(139,92,246,.18)',color:'#a78bfa'}, dev:{bg:'rgba(59,130,246,.18)',color:'#60a5fa'}, bug:{bg:'rgba(239,68,68,.18)',color:'#f87171'}, content:{bg:'rgba(34,197,94,.18)',color:'#4ade80'} }
const TAG_LABEL  = { design:'Design', dev:'Dev', bug:'Bug', content:'Conteúdo' }
const PRIO_COLOR = { high:'#ef4444', medium:'#f59e0b', low:'#22c55e' }
const PRIO_LABEL = { high:'Alta', medium:'Média', low:'Baixa' }

export default function TaskModal({ taskId, onClose }) {
  const { tasks, members, columns, updateTask, addComment, addSubtask, toggleSubtask, deleteTask, logTime, timerActive, startTimer, stopTimer, currentUser } = useStore()
  const [tab, setTab]       = useState('detail')
  const [comment, setComment] = useState('')
  const [subInput, setSubInput] = useState('')
  const [logH, setLogH]     = useState('')

  const task = tasks.find(t => t.id === taskId)
  if (!task) return null

  const col     = columns.find(c => c.id === task.col)
  const pct     = task.est === 0 ? 0 : Math.min(100, Math.round(task.logged / task.est * 100))
  const running = timerActive === task.id

  const handleComment = () => {
    if (!comment.trim()) return
    addComment(task.id, comment.trim())
    setComment('')
  }

  const handleSubtask = (e) => {
    if (e.key === 'Enter' && subInput.trim()) {
      addSubtask(task.id, subInput.trim())
      setSubInput('')
    }
  }

  const handleLogTime = () => {
    const h = parseFloat(logH)
    if (!isNaN(h) && h > 0) { logTime(task.id, h); setLogH('') }
  }

  const field = (label, el) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--tx3)', display: 'block', marginBottom: 5 }}>{label}</label>
      {el}
    </div>
  )

  const inp = { style: { width: '100%', background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 8, padding: '7px 10px', fontSize: 12, color: 'var(--tx)', outline: 'none' } }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
    >
      <div className="pop-in" style={{ background: 'var(--bg2)', borderRadius: 14, width: 680, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--bd2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <input
              key={task.id + '-title'}
              defaultValue={task.title}
              onBlur={e => updateTask(task.id, { title: e.target.value })}
              style={{ ...inp.style, background: 'none', border: 'none', fontSize: 15, fontWeight: 600, padding: '0 0 6px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 12, fontWeight: 700, background: TAG_STYLE[task.tag]?.bg, color: TAG_STYLE[task.tag]?.color }}>{TAG_LABEL[task.tag]}</span>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 12, fontWeight: 700, background: 'var(--s2)', color: PRIO_COLOR[task.priority] }}>{PRIO_LABEL[task.priority]}</span>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 12, fontWeight: 700, background: 'var(--s2)', color: col?.color }}>{col?.label}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={() => { deleteTask(task.id); onClose() }} style={{ color: 'var(--tx3)', padding: 6, borderRadius: 6, lineHeight: 0 }} title="Excluir tarefa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
            <button onClick={onClose} style={{ color: 'var(--tx3)', padding: 6, borderRadius: 6, lineHeight: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
          {['detail','subtasks','comments','time'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, color: tab===t ? 'var(--ac)' : 'var(--tx3)', borderBottom: `2px solid ${tab===t?'var(--ac)':'transparent'}`, background: 'none', transition: 'all .12s' }}>
              {{detail:'Detalhes',subtasks:'Subtarefas',comments:'Comentários',time:'Tempo'}[t]}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

          {/* DETAILS */}
          {tab === 'detail' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                {field('Descrição',
                  <textarea key={task.id+'-desc'} defaultValue={task.desc} onBlur={e => updateTask(task.id,{desc:e.target.value})} rows={4} style={{...inp.style,resize:'vertical'}} />
                )}
                {field('Responsáveis',
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {members.map(m => (
                      <button key={m.id} onClick={() => {
                        const cur = task.members
                        updateTask(task.id, { members: cur.includes(m.id) ? cur.filter(x=>x!==m.id) : [...cur,m.id] })
                      }} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:20, border:`1px solid ${task.members.includes(m.id)?m.color:'var(--bd)'}`, background:task.members.includes(m.id)?`${m.color}22`:'var(--s1)', fontSize:10, color:task.members.includes(m.id)?m.color:'var(--tx3)', fontWeight:500, transition:'all .12s' }}>
                        <div style={{ width:14, height:14, borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'#fff', fontWeight:700 }}>{m.initials}</div>
                        {m.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                  {field('Status',
                    <select key={task.id+'-col'} defaultValue={task.col} onChange={e=>updateTask(task.id,{col:e.target.value})} style={{...inp.style}}>
                      {columns.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  )}
                  {field('Prioridade',
                    <select key={task.id+'-prio'} defaultValue={task.priority} onChange={e=>updateTask(task.id,{priority:e.target.value})} style={{...inp.style}}>
                      <option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option>
                    </select>
                  )}
                  {field('Categoria',
                    <select key={task.id+'-tag'} defaultValue={task.tag} onChange={e=>updateTask(task.id,{tag:e.target.value})} style={{...inp.style}}>
                      <option value="dev">Dev</option><option value="design">Design</option><option value="bug">Bug</option><option value="content">Conteúdo</option>
                    </select>
                  )}
                  {field('Estimativa (h)',
                    <input key={task.id+'-est'} type="number" defaultValue={task.est} onBlur={e=>updateTask(task.id,{est:parseFloat(e.target.value)||0})} step="0.5" {...inp} />
                  )}
                </div>
                {field('Prazo',
                  <input key={task.id+'-date'} type="date" defaultValue={task.date} onBlur={e=>updateTask(task.id,{date:e.target.value})} {...inp} />
                )}
              </div>
            </div>
          )}

          {/* SUBTASKS */}
          {tab === 'subtasks' && (
            <div>
              <input value={subInput} onChange={e=>setSubInput(e.target.value)} onKeyDown={handleSubtask} placeholder="Nova subtarefa (Enter para adicionar)..." style={{...inp.style,marginBottom:12}} />
              {task.subtasks.map(s => (
                <div key={s.id} onClick={()=>toggleSubtask(task.id,s.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, background:'var(--s1)', cursor:'pointer', border:'1px solid var(--bd)', marginBottom:5 }}>
                  <div style={{ width:14, height:14, borderRadius:4, border:`1.5px solid ${s.done?'#22c55e':'var(--bd2)'}`, background:s.done?'#22c55e':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                    {s.done && <span style={{ fontSize:9, color:'#fff', fontWeight:700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:12, color:s.done?'var(--tx3)':'var(--tx)', textDecoration:s.done?'line-through':'none' }}>{s.title}</span>
                </div>
              ))}
              {task.subtasks.length === 0 && <div style={{ textAlign:'center', padding:'24px 0', color:'var(--tx3)', fontSize:12 }}>Nenhuma subtarefa ainda</div>}
            </div>
          )}

          {/* COMMENTS */}
          {tab === 'comments' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleComment()} placeholder="Adicionar comentário... (@mencionar)" style={{...inp.style,flex:1}} />
                <button onClick={handleComment} style={{ padding:'7px 13px', background:'var(--ac)', borderRadius:8, color:'#fff', fontSize:11, fontWeight:600, border:'none', cursor:'pointer' }}>Enviar</button>
              </div>
              {task.comments.map(c => {
                const m = members.find(x=>x.id===c.user)
                return (
                  <div key={c.id} style={{ display:'flex', gap:9, marginBottom:10 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:m?.color||'var(--s2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>{m?.initials||'?'}</div>
                    <div style={{ flex:1, background:'var(--s1)', borderRadius:9, padding:'8px 11px', border:'1px solid var(--bd)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:600 }}>{m?.name||'Usuário'}</span>
                        <span style={{ fontSize:10, color:'var(--tx3)' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize:12, color:'var(--tx2)', lineHeight:1.5 }}>{c.text}</div>
                    </div>
                  </div>
                )
              })}
              {task.comments.length === 0 && <div style={{ textAlign:'center', padding:'24px 0', color:'var(--tx3)', fontSize:12 }}>Nenhum comentário ainda</div>}
            </div>
          )}

          {/* TIME */}
          {tab === 'time' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                {[{l:'Estimado',v:`${task.est}h`,c:'#60a5fa'},{l:'Registrado',v:`${task.logged}h`,c:'#4ade80'},{l:'Progresso',v:`${pct}%`,c:pct>=100?'#4ade80':'#f59e0b'}].map(s=>(
                  <div key={s.l} style={{ background:'var(--s1)', borderRadius:10, padding:'12px', textAlign:'center', border:'1px solid var(--bd)' }}>
                    <div style={{ fontSize:20, fontWeight:700, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, color:'var(--tx3)', marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--s1)', borderRadius:10, padding:'14px', marginBottom:12, border:'1px solid var(--bd)' }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--tx3)', marginBottom:9 }}>Cronômetro</div>
                <button
                  onClick={() => running ? stopTimer() : startTimer(task.id)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:8, background:running?'rgba(239,68,68,.12)':'rgba(34,197,94,.12)', color:running?'#f87171':'#4ade80', border:`1px solid ${running?'rgba(239,68,68,.25)':'rgba(34,197,94,.25)'}`, fontSize:12, fontWeight:600, cursor:'pointer' }}
                >
                  {running ? '⏹  Pausar cronômetro' : '▶  Iniciar cronômetro'}
                </button>
              </div>
              <div style={{ background:'var(--s1)', borderRadius:10, padding:'14px', border:'1px solid var(--bd)' }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--tx3)', marginBottom:9 }}>Registro manual</div>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="number" value={logH} onChange={e=>setLogH(e.target.value)} placeholder="Ex: 1.5" step="0.5" min="0.1" style={{...inp.style,flex:1}} />
                  <button onClick={handleLogTime} style={{ padding:'7px 14px', background:'var(--ac)', borderRadius:8, color:'#fff', fontSize:11, fontWeight:600, border:'none', cursor:'pointer' }}>Registrar</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
