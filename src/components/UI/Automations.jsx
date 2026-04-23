import { useStore } from '../../store'

const SUGGESTIONS = [
  'Ao criar → definir prioridade automática',
  'Mover para revisão → notificar gestor',
  'Prazo em 2 dias → criar alerta',
  'Tarefa sem dono → atribuir automaticamente',
  'Concluída → gerar entrada de relatório',
  'WIP atingido → bloquear nova entrada',
]

export default function Automations() {
  const { automations, toggleAutoRule } = useStore()

  return (
    <div style={{ padding:14, overflowY:'auto', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:12, color:'var(--tx3)' }}>{automations.filter(a=>a.active).length} de {automations.length} regras ativas</span>
        <button style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:8, background:'var(--ac)', color:'#fff', fontSize:11, fontWeight:600 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova automação
        </button>
      </div>

      {automations.map((a,i) => (
        <div key={a.id} className="fade-up" style={{ animationDelay:`${i*.06}s`, background:'var(--bg2)', borderRadius:12, padding:'13px 15px', border:`1px solid ${a.active?'rgba(34,197,94,.2)':'var(--bd)'}`, display:'flex', alignItems:'center', gap:12, marginBottom:8, transition:'border-color .15s' }}>
          <div style={{ width:34, height:34, borderRadius:9, background:a.active?'rgba(34,197,94,.1)':'var(--s2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={a.active?'#4ade80':'var(--tx3)'} strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:500, marginBottom:5 }}>{a.label}</div>
            <div style={{ display:'flex', gap:6 }}>
              <span style={{ fontSize:9, padding:'2px 7px', borderRadius:12, fontWeight:600, background:'rgba(96,165,250,.12)', color:'#60a5fa' }}>gatilho: {a.trigger}</span>
              <span style={{ fontSize:9, padding:'2px 7px', borderRadius:12, fontWeight:600, background:'rgba(167,139,250,.12)', color:'#a78bfa' }}>ação: {a.action}</span>
            </div>
          </div>
          {/* Toggle */}
          <button
            onClick={() => toggleAutoRule(a.id)}
            style={{ width:38, height:20, borderRadius:10, background:a.active?'#22c55e':'var(--s3)', border:'none', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}
          >
            <div style={{ position:'absolute', top:3, left:a.active?21:3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .2s' }} />
          </button>
        </div>
      ))}

      <div style={{ background:'var(--bg2)', borderRadius:12, padding:'14px', border:'1px solid var(--bd)', marginTop:16 }}>
        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--tx3)', marginBottom:11 }}>Adicionar regra</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:7 }}>
          {SUGGESTIONS.map(s=>(
            <div key={s} style={{ padding:'9px 11px', background:'var(--s1)', borderRadius:8, border:'1px dashed var(--bd)', fontSize:10, color:'var(--tx3)', cursor:'pointer', transition:'all .12s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--s2)';e.currentTarget.style.color='var(--tx2)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--s1)';e.currentTarget.style.color='var(--tx3)'}}>
              + {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
