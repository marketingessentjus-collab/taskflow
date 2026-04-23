import { useStore } from '../../store'

const TAG_LABELS = { all: 'Todos', design: 'Design', dev: 'Dev', bug: 'Bug', content: 'Conteúdo' }
const PRIO_LABELS = { high: 'Alta', medium: 'Média', low: 'Baixa' }

export default function Topbar({ onAddTask }) {
  const {
    search, setSearch, activeView,
    filterTag, setFilterTag,
    filterPrio, setFilterPrio,
    members,
  } = useStore()

  const showFilters = activeView === 'board' || activeView === 'list'
  const pageTitle = {
    board: 'Quadro de Tarefas', list: 'Lista de Tarefas',
    members: 'Membros do Time', reports: 'Relatórios & Métricas',
    auto: 'Automações', settings: 'Configurações',
  }[activeView] || 'TaskFlow'

  const chip = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{
      fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
      border: `1px solid ${active ? 'rgba(233,69,96,.35)' : 'var(--bd)'}`,
      background: active ? 'rgba(233,69,96,.14)' : 'var(--s1)',
      color: active ? '#fca5a5' : 'var(--tx3)',
      cursor: 'pointer', transition: 'all .12s',
    }}>{label}</button>
  )

  return (
    <div style={{ background: 'var(--bg1)', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{pageTitle}</div>
          <div style={{ fontSize: 9, background: 'rgba(34,197,94,.12)', color: '#4ade80', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Sprint 4</div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 8, color: 'var(--tx3)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tarefas..."
              style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 7, padding: '6px 10px 6px 27px', fontSize: 11, color: 'var(--tx)', width: 170, outline: 'none' }}
            />
          </div>

          {/* Avatars */}
          <div style={{ display: 'flex' }}>
            {members.slice(0, 4).map((m, i) => (
              <div key={m.id} style={{ width: 25, height: 25, borderRadius: '50%', background: m.color, border: '2px solid var(--bg1)', marginLeft: i === 0 ? 0 : -6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', zIndex: 4 - i }} title={m.name}>
                {m.initials}
              </div>
            ))}
          </div>

          <button
            onClick={onAddTask}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 7, background: 'var(--ac)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tarefa
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(TAG_LABELS).map(([val, label]) =>
            chip(label, filterTag === val, () => setFilterTag(val))
          )}
          <div style={{ width: 1, height: 14, background: 'var(--bd)', margin: '0 3px' }} />
          {Object.entries(PRIO_LABELS).map(([val, label]) =>
            chip(label, filterPrio === val, () => setFilterPrio(filterPrio === val ? 'all' : val))
          )}
        </div>
      )}
    </div>
  )
}
