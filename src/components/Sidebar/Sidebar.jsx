import { useStore } from '../../store'

const PROJECTS = [
  { label: 'Design System', color: '#e94560' },
  { label: 'Backend API',   color: '#22c55e' },
  { label: 'Mobile App',    color: '#f59e0b' },
  { label: 'Marketing',     color: '#60a5fa' },
]

const NAV_ITEMS = [
  { id: 'board',   label: 'Quadro',      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: 'list',    label: 'Lista',       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg> },
  { id: 'members', label: 'Membros',     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.85"/></svg> },
  { id: 'reports', label: 'Relatórios',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: 'auto',    label: 'Automações',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { id: 'trello',    label: 'Importar Trello', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
  { id: 'assistant', label: 'Assistente AI',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
]

export default function Sidebar() {
  const { activeView, setView, sidebarOpen, toggleSidebar, currentUser, theme, toggleTheme } = useStore()
  const c = sidebarOpen

  return (
    <aside style={{
      width: c ? 196 : 52,
      background: 'var(--bg1)',
      borderRight: '1px solid var(--bd)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width .2s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '13px 12px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 9, minHeight: 50, justifyContent: c ? 'flex-start' : 'center' }}>
        <div style={{ width: 27, height: 27, background: 'var(--ac)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>T</div>
        {c && <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>TaskFlow</span>}
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 5px', flex: 1, overflow: 'hidden' }}>
        {c && <div style={{ fontSize: 9, letterSpacing: '1.3px', color: 'var(--tx3)', padding: '10px 7px 4px', textTransform: 'uppercase' }}>Workspace</div>}
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            title={!c ? label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: c ? '7px 9px' : '9px',
              margin: '1px 0', borderRadius: 7,
              width: '100%', fontSize: 11, fontWeight: 500,
              justifyContent: c ? 'flex-start' : 'center',
              color: activeView === id ? '#fca5a5' : 'var(--tx3)',
              background: activeView === id ? 'rgba(233,69,96,.12)' : 'transparent',
              transition: 'all .12s',
            }}
          >
            {icon}
            {c && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
          </button>
        ))}

        {c && (
          <>
            <div style={{ fontSize: 9, letterSpacing: '1.3px', color: 'var(--tx3)', padding: '12px 7px 4px', textTransform: 'uppercase' }}>Projetos</div>
            {PROJECTS.map(p => (
              <button key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7, width: '100%', fontSize: 11, color: 'var(--tx3)', transition: 'all .12s' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: '8px 5px', borderTop: '1px solid var(--bd)' }}>
        <button
          onClick={toggleTheme}
          title={!c ? (theme === 'dark' ? 'Tema claro' : 'Tema escuro') : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: c ? '7px 9px' : '9px', borderRadius: 7, width: '100%', fontSize: 11, color: 'var(--tx3)', justifyContent: c ? 'flex-start' : 'center', transition: 'all .12s' }}>
          {theme === 'dark'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
          {c && <span>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>}
        </button>
        <button
          onClick={toggleSidebar}
          title={!c ? 'Expandir' : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: c ? '7px 9px' : '9px', borderRadius: 7, width: '100%', fontSize: 11, color: 'var(--tx3)', justifyContent: c ? 'flex-start' : 'center', transition: 'all .12s' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: c ? 'none' : 'rotate(180deg)', transition: 'transform .2s' }}><polyline points="15 18 9 12 15 6"/></svg>
          {c && <span>Recolher</span>}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: c ? '7px 9px' : '9px', justifyContent: c ? 'flex-start' : 'center' }}>
          <div style={{ width: 25, height: 25, borderRadius: '50%', background: '#9b59b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>AL</div>
          {c && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ana Lima</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>Designer · Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
