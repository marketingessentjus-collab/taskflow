import { useState, useEffect } from 'react'
import { useStore } from './store'
import Sidebar       from './components/Sidebar/Sidebar'
import Topbar        from './components/Sidebar/Topbar'
import Board         from './components/Board/Board'
import ListView      from './components/Board/ListView'
import Members       from './components/Members/Members'
import Reports       from './components/Reports/Reports'
import Automations   from './components/UI/Automations'
import TrelloImport  from './components/UI/TrelloImport'
import Assistant     from './components/UI/Assistant'
import TaskModal     from './components/Modals/TaskModal'
import AddTaskModal  from './components/Modals/AddTaskModal'

export default function App() {
  const { activeView, theme, activeTaskId, setActiveTask } = useStore()
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg0)' }}>
      <Sidebar />

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <Topbar onAddTask={() => setShowAdd(true)} />

        <main style={{ flex:1, overflow:'hidden' }}>
          {activeView === 'board'   && <Board    onOpenTask={setActiveTask} />}
          {activeView === 'list'    && <ListView onOpenTask={setActiveTask} />}
          {activeView === 'members' && <Members />}
          {activeView === 'reports' && <Reports />}
          {activeView === 'auto'    && <Automations />}
          {activeView === 'trello'  && <TrelloImport />}
          {activeView === 'assistant' && <Assistant />}
          {activeView === 'settings' && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--tx3)', gap:12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              <div style={{ fontSize:14, fontWeight:500 }}>Configurações</div>
              <div style={{ fontSize:12 }}>Em breve — integração com API, webhooks, perfil e permissões</div>
            </div>
          )}
        </main>
      </div>

      {activeTaskId && <TaskModal taskId={activeTaskId} onClose={() => setActiveTask(null)} />}
      {showAdd      && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
