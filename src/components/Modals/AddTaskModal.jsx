import { useState } from 'react'
import { useStore } from '../../store'

export default function AddTaskModal({ onClose }) {
  const { columns, members, addTask } = useStore()
  const [form, setForm] = useState({ title:'', desc:'', tag:'dev', priority:'medium', col:'todo', est:2, date:'', members:[] })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const toggleMember = (id) => set('members', form.members.includes(id) ? form.members.filter(x=>x!==id) : [...form.members,id])

  const inp = { style:{ width:'100%', background:'var(--s1)', border:'1px solid var(--bd)', borderRadius:8, padding:'7px 10px', fontSize:12, color:'var(--tx)', outline:'none' } }
  const label = (txt) => <label style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--tx3)', display:'block', marginBottom:5 }}>{txt}</label>

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div className="pop-in" style={{ background:'var(--bg2)', borderRadius:14, width:500, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', border:'1px solid var(--bd2)' }}>
        <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--bd)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:14, fontWeight:600 }}>Nova Tarefa</span>
          <button onClick={onClose} style={{ color:'var(--tx3)', lineHeight:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding:'14px 16px' }}>
          <div style={{ marginBottom:12 }}>
            {label('Título *')}
            <input autoFocus value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Nome da tarefa..." {...inp} onKeyDown={e=>e.key==='Enter'&&form.title.trim()&&(addTask({...form,est:parseFloat(form.est)||2}),onClose())} />
          </div>
          <div style={{ marginBottom:12 }}>
            {label('Descrição')}
            <textarea value={form.desc} onChange={e=>set('desc',e.target.value)} placeholder="Detalhamento, critérios de aceite, links..." rows={3} style={{...inp.style,resize:'vertical'}} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            <div>{label('Categoria')}
              <select value={form.tag} onChange={e=>set('tag',e.target.value)} {...inp}>
                <option value="dev">Dev</option><option value="design">Design</option><option value="bug">Bug</option><option value="content">Conteúdo</option>
              </select>
            </div>
            <div>{label('Prioridade')}
              <select value={form.priority} onChange={e=>set('priority',e.target.value)} {...inp}>
                <option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option>
              </select>
            </div>
            <div>{label('Coluna')}
              <select value={form.col} onChange={e=>set('col',e.target.value)} {...inp}>
                {columns.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>{label('Estimativa (h)')}
              <input type="number" value={form.est} onChange={e=>set('est',e.target.value)} min="0.5" step="0.5" {...inp} />
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            {label('Prazo')}
            <input type="date" value={form.date} onChange={e=>set('date',e.target.value)} {...inp} />
          </div>

          <div style={{ marginBottom:16 }}>
            {label('Responsáveis')}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {members.map(m=>(
                <button key={m.id} onClick={()=>toggleMember(m.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:20, border:`1px solid ${form.members.includes(m.id)?m.color:'var(--bd)'}`, background:form.members.includes(m.id)?`${m.color}22`:'var(--s1)', fontSize:10, color:form.members.includes(m.id)?m.color:'var(--tx3)', fontWeight:500, transition:'all .12s', cursor:'pointer' }}>
                  <div style={{ width:14, height:14, borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'#fff', fontWeight:700 }}>{m.initials}</div>
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid var(--bd)', color:'var(--tx3)', fontSize:12, cursor:'pointer', background:'none' }}>Cancelar</button>
            <button onClick={()=>{ if(!form.title.trim())return; addTask({...form,est:parseFloat(form.est)||2}); onClose() }} style={{ padding:'8px 18px', borderRadius:8, background:'var(--ac)', color:'#fff', fontSize:12, fontWeight:600, border:'none', cursor:'pointer' }}>
              Criar Tarefa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
