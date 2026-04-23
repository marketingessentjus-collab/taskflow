import { useStore } from '../../store'

const Bar = ({ label, val, max, color, suffix='' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
    <span style={{ width:70, fontSize:10, color:'var(--tx2)', textAlign:'right', flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>
    <div style={{ flex:1, background:'var(--s2)', borderRadius:3, height:7, overflow:'hidden' }}>
      <div style={{ width:`${max===0?0:Math.min(100,Math.round(val/max*100))}%`, height:'100%', background:color, borderRadius:3, transition:'width .6s' }} />
    </div>
    <span style={{ width:32, fontSize:10, color:'var(--tx3)' }}>{val}{suffix}</span>
  </div>
)

const Card = ({ label, val, color, sub }) => (
  <div style={{ background:'var(--bg2)', borderRadius:11, padding:'12px', border:'1px solid var(--bd)', textAlign:'center' }}>
    <div style={{ fontSize:22, fontWeight:700, color }}>{val}</div>
    <div style={{ fontSize:10, fontWeight:600, color:'var(--tx2)', marginTop:3 }}>{label}</div>
    {sub && <div style={{ fontSize:9, color:'var(--tx3)', marginTop:2 }}>{sub}</div>}
  </div>
)

const Section = ({ title, children }) => (
  <div style={{ background:'var(--bg2)', borderRadius:12, padding:'14px', border:'1px solid var(--bd)' }}>
    <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--tx3)', marginBottom:13 }}>{title}</div>
    {children}
  </div>
)

export default function Reports() {
  const { tasks, members, columns } = useStore()
  const today = new Date().toISOString().split('T')[0]

  const total    = tasks.length
  const done     = tasks.filter(t=>t.col==='done').length
  const progress = tasks.filter(t=>t.col==='progress').length
  const overdue  = tasks.filter(t=>t.date&&t.date<today&&t.col!=='done').length
  const hours    = parseFloat(tasks.reduce((a,t)=>a+t.logged,0).toFixed(1))
  const estHours = tasks.reduce((a,t)=>a+t.est,0)
  const eff      = estHours===0 ? 0 : Math.round(hours/estHours*100)

  const memberStats = members.map(m=>{
    const mt = tasks.filter(t=>t.members.includes(m.id))
    return { ...m, count:mt.length, hours:parseFloat(mt.reduce((a,t)=>a+t.logged,0).toFixed(1)), done:mt.filter(t=>t.col==='done').length, est:mt.reduce((a,t)=>a+t.est,0) }
  })

  const maxCount = Math.max(...memberStats.map(m=>m.count), 1)
  const maxHours = Math.max(...memberStats.map(m=>m.hours), 1)

  return (
    <div style={{ padding:14, overflowY:'auto', height:'100%' }}>
      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:9, marginBottom:12 }}>
        <Card label="Total"        val={total}    color="var(--tx)"  />
        <Card label="Concluídas"   val={done}     color="#4ade80"    sub={`${Math.round(done/total*100)||0}% do total`} />
        <Card label="Em andamento" val={progress} color="#f59e0b"    />
        <Card label="Atrasadas"    val={overdue}  color="#f87171"    />
        <Card label="Horas log."   val={`${hours}h`} color="#60a5fa" sub={`de ${estHours}h estimadas`} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
        <Section title="Tarefas por membro">
          {memberStats.map(m=><Bar key={m.id} label={m.name.split(' ')[0]} val={m.count} max={maxCount} color={m.color} />)}
        </Section>
        <Section title="Horas registradas por membro">
          {memberStats.map(m=><Bar key={m.id} label={m.name.split(' ')[0]} val={m.hours} max={maxHours} color={m.color} suffix="h" />)}
        </Section>
        <Section title="Distribuição por categoria">
          {[['design','Design','#a78bfa'],['dev','Dev','#60a5fa'],['bug','Bug','#f87171'],['content','Conteúdo','#4ade80']].map(([tag,label,color])=>(
            <Bar key={tag} label={label} val={tasks.filter(t=>t.tag===tag).length} max={total} color={color} />
          ))}
        </Section>
        <Section title="Status por coluna">
          {columns.map(col=>(
            <Bar key={col.id} label={col.label} val={tasks.filter(t=>t.col===col.id).length} max={total} color={col.color} />
          ))}
        </Section>
      </div>

      <Section title={`Eficiência de tempo — estimado vs registrado (${eff}% de aproveitamento)`}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:9, marginBottom:14 }}>
          {[{l:'Estimado',v:`${estHours}h`,c:'#60a5fa'},{l:'Registrado',v:`${hours}h`,c:'#4ade80'},{l:'Eficiência',v:`${eff}%`,c:eff>110?'#f87171':'#4ade80'}].map(s=>(
            <div key={s.l} style={{ background:'var(--s1)', borderRadius:9, padding:'10px', textAlign:'center', border:'1px solid var(--bd)' }}>
              <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:9, color:'var(--tx3)', marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {memberStats.filter(m=>m.est>0).map(m=>(
          <div key={m.id} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, color:'#fff', flexShrink:0 }}>{m.initials}</div>
            <span style={{ width:68, fontSize:10, color:'var(--tx2)', flexShrink:0 }}>{m.name.split(' ')[0]}</span>
            <div style={{ flex:1, background:'var(--s2)', borderRadius:3, height:10, overflow:'hidden' }}>
              <div style={{ width:`${Math.min(100,Math.round(m.hours/m.est*100))}%`, height:'100%', background:`${m.color}99`, borderRadius:3 }} />
            </div>
            <span style={{ fontSize:9, color:'var(--tx3)', width:55 }}>{m.hours}h/{m.est}h</span>
          </div>
        ))}
      </Section>
    </div>
  )
}
