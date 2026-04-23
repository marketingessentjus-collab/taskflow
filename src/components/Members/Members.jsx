import { useState } from 'react'
import { useStore } from '../../store'

const ROLE_COLORS = { Designer:'#a78bfa', 'Frontend Dev':'#60a5fa', 'Backend Dev':'#4ade80', 'Mobile Dev':'#fb923c', 'Conteúdo':'#f87171', Gestor:'#f59e0b', Admin:'#e94560', Membro:'#94a3b8' }

export default function Members() {
  const { members, tasks, addMember } = useStore()
  const [adding, setAdding] = useState(false)
  const [form, setForm]     = useState({ name:'', role:'Dev', color:'#3498db' })
  const today = new Date().toISOString().split('T')[0]

  const getStats = (id) => {
    const mt = tasks.filter(t=>t.members.includes(id))
    return {
      total:    mt.length,
      done:     mt.filter(t=>t.col==='done').length,
      progress: mt.filter(t=>t.col==='progress').length,
      hours:    parseFloat(mt.reduce((a,t)=>a+t.logged,0).toFixed(1)),
      overdue:  mt.filter(t=>t.date&&t.date<today&&t.col!=='done').length,
    }
  }

  const handleAdd = () => {
    if (!form.name.trim()) return
    addMember(form)
    setForm({ name:'', role:'Dev', color:'#3498db' })
    setAdding(false)
  }

  return (
    <div style={{ padding:14, overflowY:'auto', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:12, color:'var(--tx3)' }}>{members.length} membros no time</span>
        <button onClick={()=>setAdding(true)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:8, background:'var(--ac)', color:'#fff', fontSize:11, fontWeight:600 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo membro
        </button>
      </div>

      {adding && (
        <div className="pop-in" style={{ background:'var(--bg2)', border:'1px solid var(--bd2)', borderRadius:12, padding:14, marginBottom:12, display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-end' }}>
          <div style={{ flex:1, minWidth:140 }}>
            <label style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--tx3)', display:'block', marginBottom:5 }}>Nome</label>
            <input autoFocus value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome completo" style={{ width:'100%', background:'var(--s1)', border:'1px solid var(--bd)', borderRadius:8, padding:'7px 9px', fontSize:12, color:'var(--tx)', outline:'none' }} />
          </div>
          <div style={{ width:130 }}>
            <label style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--tx3)', display:'block', marginBottom:5 }}>Função</label>
            <input value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="Ex: Dev" style={{ width:'100%', background:'var(--s1)', border:'1px solid var(--bd)', borderRadius:8, padding:'7px 9px', fontSize:12, color:'var(--tx)', outline:'none' }} />
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{ width:36, height:34, borderRadius:8, border:'1px solid var(--bd)', background:'none', cursor:'pointer', padding:2 }} />
            <button onClick={handleAdd} style={{ padding:'7px 13px', background:'var(--ac)', borderRadius:8, color:'#fff', fontSize:11, fontWeight:600, border:'none', cursor:'pointer' }}>Adicionar</button>
            <button onClick={()=>setAdding(false)} style={{ padding:'7px', lineHeight:0, borderRadius:8, border:'1px solid var(--bd)', color:'var(--tx3)', cursor:'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:11 }}>
        {members.map((m,i) => {
          const s   = getStats(m.id)
          const pct = s.total === 0 ? 0 : Math.round(s.done / s.total * 100)
          return (
            <div key={m.id} className="fade-up" style={{ animationDelay:`${i*.04}s`, background:'var(--bg2)', borderRadius:13, padding:'14px', border:'1px solid var(--bd)', transition:'border-color .12s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--bd2)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--bd)'}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${m.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:m.color, flexShrink:0 }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{m.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                    <span style={{ fontSize:9, padding:'2px 7px', borderRadius:12, background:`${ROLE_COLORS[m.role]||'#94a3b8'}22`, color:ROLE_COLORS[m.role]||'#94a3b8', fontWeight:700 }}>{m.role}</span>
                    {s.overdue>0 && <span style={{ fontSize:9, padding:'2px 7px', borderRadius:12, background:'rgba(239,68,68,.12)', color:'#f87171', fontWeight:700 }}>⚠ {s.overdue}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:11 }}>
                {[{l:'Tarefas',v:s.total,c:'var(--tx)'},{l:'Feitas',v:s.done,c:'#4ade80'},{l:'Andamento',v:s.progress,c:'#f59e0b'},{l:'Horas',v:`${s.hours}h`,c:'#60a5fa'}].map(st=>(
                  <div key={st.l} style={{ background:'var(--s1)', borderRadius:8, padding:'7px 5px', textAlign:'center' }}>
                    <div style={{ fontSize:15, fontWeight:700, color:st.c }}>{st.v}</div>
                    <div style={{ fontSize:8, color:'var(--tx3)', marginTop:2, lineHeight:1.2 }}>{st.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:9, color:'var(--tx3)' }}>Conclusão do sprint</span>
                <span style={{ fontSize:9, color:pct>=80?'#4ade80':'var(--tx2)' }}>{pct}%</span>
              </div>
              <div style={{ background:'var(--s2)', borderRadius:3, height:4, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:pct>=80?'#22c55e':pct>=50?'#f59e0b':'#e94560', borderRadius:3, transition:'width .5s' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
