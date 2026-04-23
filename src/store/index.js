import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_COLUMNS = [
  { id: 'todo',     label: 'A Fazer',       color: '#64748b', wip: null },
  { id: 'progress', label: 'Em Progresso',  color: '#f59e0b', wip: 5    },
  { id: 'review',   label: 'Revisão',       color: '#60a5fa', wip: 3    },
  { id: 'done',     label: 'Concluído',     color: '#22c55e', wip: null },
]

const DEFAULT_MEMBERS = [
  { id: 'u1', name: 'Ana Lima',    initials: 'AL', color: '#9b59b6', role: 'Designer'    },
  { id: 'u2', name: 'Bruno Souza', initials: 'BS', color: '#3498db', role: 'Frontend Dev' },
  { id: 'u3', name: 'Carla Dias',  initials: 'CD', color: '#2ecc71', role: 'Backend Dev'  },
  { id: 'u4', name: 'Diego Rocha', initials: 'DR', color: '#e67e22', role: 'Mobile Dev'   },
  { id: 'u5', name: 'Elisa Ferr.', initials: 'EF', color: '#e74c3c', role: 'Conteúdo'     },
]

const DEFAULT_TASKS = [
  { id:'t1',  title:'Redesenhar tela de login',     tag:'design',  priority:'high',   members:['u1'],      col:'todo',     logged:0, est:4, date:'2026-04-28', subtasks:[{id:'s1',title:'Wireframe',done:true},{id:'s2',title:'Protótipo',done:false}], comments:[], desc:'Atualizar UI seguindo novo design system.' },
  { id:'t2',  title:'API de autenticação JWT',       tag:'dev',     priority:'high',   members:['u2'],      col:'progress', logged:3, est:8, date:'2026-04-20', subtasks:[{id:'s3',title:'Endpoint login',done:true},{id:'s4',title:'Refresh token',done:true},{id:'s5',title:'Testes',done:false}], comments:[{id:'c1',user:'u3',text:'Adicionar rate limiting!',time:'15/04'}], desc:'Endpoints de login, refresh e logout.' },
  { id:'t3',  title:'Corrigir bug no carrinho',      tag:'bug',     priority:'high',   members:['u3'],      col:'review',   logged:2, est:2, date:'2026-04-18', subtasks:[], comments:[], desc:'Itens duplicados ao adicionar produto.' },
  { id:'t4',  title:'Posts para redes sociais',      tag:'content', priority:'low',    members:['u5'],      col:'todo',     logged:0, est:3, date:'2026-04-25', subtasks:[], comments:[], desc:'10 posts para Instagram e LinkedIn.' },
  { id:'t5',  title:'Tela de perfil do usuário',     tag:'design',  priority:'medium', members:['u1','u2'], col:'progress', logged:2, est:6, date:'2026-04-21', subtasks:[{id:'s6',title:'Layout mobile',done:false}], comments:[], desc:'Edição de avatar, nome, bio e notificações.' },
  { id:'t6',  title:'Endpoint de notificações',      tag:'dev',     priority:'medium', members:['u4'],      col:'todo',     logged:0, est:5, date:'2026-04-23', subtasks:[], comments:[], desc:'Notificações em tempo real via WebSocket.' },
  { id:'t7',  title:'Onboarding — 3 emails',         tag:'content', priority:'low',    members:['u5'],      col:'done',     logged:4, est:4, date:'2026-04-16', subtasks:[], comments:[], desc:'Sequência dia 1, dia 3 e dia 7.' },
  { id:'t8',  title:'Testes E2E — checkout',         tag:'dev',     priority:'high',   members:['u2','u3'], col:'review',   logged:5, est:6, date:'2026-04-19', subtasks:[{id:'s7',title:'Happy path',done:true},{id:'s8',title:'Casos de erro',done:false}], comments:[], desc:'Cobertura completa do fluxo de compra.' },
  { id:'t9',  title:'Componente de tabela',           tag:'dev',     priority:'low',    members:['u3'],      col:'done',     logged:3, est:3, date:'2026-04-15', subtasks:[], comments:[], desc:'Tabela reutilizável com ordenação e paginação.' },
  { id:'t10', title:'Pesquisa UX com usuários',       tag:'design',  priority:'medium', members:['u1'],      col:'todo',     logged:0, est:8, date:'2026-04-28', subtasks:[], comments:[], desc:'Entrevistas com 8 usuários.' },
]

const DEFAULT_AUTOMATIONS = [
  { id:'a1', label:'Ao concluir → notificar responsável',    trigger:'status_change', action:'notify_assignee', active:true  },
  { id:'a2', label:'Prazo em 1 dia → enviar lembrete',       trigger:'due_soon',       action:'send_reminder',   active:true  },
  { id:'a3', label:'Alta prioridade criada → avisar gestor', trigger:'task_created',   action:'assign_manager',  active:false },
]

export const useStore = create(
  persist(
    (set, get) => ({
      columns:     DEFAULT_COLUMNS,
      tasks:       DEFAULT_TASKS,
      members:     DEFAULT_MEMBERS,
      automations: DEFAULT_AUTOMATIONS,
      activeView:  'board',
      activeTaskId: null,
      search:      '',
      filterTag:   'all',
      filterPrio:  'all',
      currentUser: DEFAULT_MEMBERS[0],
      sidebarOpen: true,
      theme:       'dark',
      timerActive: null,
      timerStart:  null,

      addColumn: (label) => set(s => ({ columns: [...s.columns, { id:'col_'+Date.now(), label, color:'#a78bfa', wip:null }] })),
      updateColumn: (id, data) => set(s => ({ columns: s.columns.map(c => c.id===id ? {...c,...data} : c) })),
      deleteColumn: (id) => set(s => ({ columns: s.columns.filter(c=>c.id!==id), tasks: s.tasks.filter(t=>t.col!==id) })),

      addTask: (data) => set(s => ({
        tasks: [...s.tasks, { id:'t'+Date.now(), title:data.title, desc:data.desc||'', tag:data.tag||'dev', priority:data.priority||'medium', members:data.members||[], col:data.col||'todo', logged:0, est:data.est||2, date:data.date||'', subtasks:[], comments:[], created:new Date().toISOString().split('T')[0] }]
      })),
      updateTask: (id, data) => set(s => ({ tasks: s.tasks.map(t => t.id===id ? {...t,...data} : t) })),
      moveTask: (taskId, toColId) => {
        const { tasks, columns } = get()
        const col = columns.find(c=>c.id===toColId)
        const task = tasks.find(t=>t.id===taskId)
        if (!task) return false
        const colCount = tasks.filter(t=>t.col===toColId).length
        if (col?.wip && colCount >= col.wip && task.col !== toColId) return false
        set(s => ({ tasks: s.tasks.map(t => t.id!==taskId ? t : {...t, col:toColId, logged:toColId==='done'?t.est:t.logged}) }))
        return true
      },
      deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t=>t.id!==id) })),

      addComment: (taskId, text) => {
        const u = get().currentUser
        const comment = { id:'c'+Date.now(), user:u.id, text, time:new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}) }
        set(s => ({ tasks: s.tasks.map(t => t.id===taskId ? {...t, comments:[...t.comments, comment]} : t) }))
      },
      addSubtask: (taskId, title) => set(s => ({ tasks: s.tasks.map(t => t.id===taskId ? {...t, subtasks:[...t.subtasks,{id:'s'+Date.now(),title,done:false}]} : t) })),
      toggleSubtask: (taskId, subId) => set(s => ({ tasks: s.tasks.map(t => t.id===taskId ? {...t, subtasks:t.subtasks.map(s=>s.id===subId?{...s,done:!s.done}:s)} : t) })),
      logTime: (taskId, hours) => set(s => ({ tasks: s.tasks.map(t => t.id===taskId ? {...t, logged:parseFloat(Math.min(t.est*2, t.logged+hours).toFixed(2))} : t) })),

      addMember: (data) => set(s => ({
        members: [...s.members, { id:'u'+Date.now(), name:data.name, initials:data.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2), color:data.color||'#888', role:data.role||'Membro' }]
      })),

      startTimer: (taskId) => set({ timerActive:taskId, timerStart:Date.now() }),
      stopTimer: () => {
        const { timerActive, timerStart } = get()
        if (timerActive && timerStart) {
          const hrs = parseFloat(((Date.now()-timerStart)/3_600_000).toFixed(2))
          get().logTime(timerActive, hrs)
        }
        set({ timerActive:null, timerStart:null })
      },

      toggleAutoRule: (id) => set(s => ({ automations: s.automations.map(a => a.id===id ? {...a,active:!a.active} : a) })),

      setView:       (v) => set({ activeView:v }),
      setActiveTask: (id) => set({ activeTaskId:id }),
      setSearch:     (v) => set({ search:v }),
      setFilterTag:  (v) => set({ filterTag:v }),
      setFilterPrio: (v) => set({ filterPrio:v }),
      toggleSidebar: () => set(s => ({ sidebarOpen:!s.sidebarOpen })),
      toggleTheme:   () => set(s => ({ theme:s.theme==='dark'?'light':'dark' })),

      filteredTasks: () => {
        const { tasks, search, filterTag, filterPrio } = get()
        return tasks.filter(t => {
          if (filterTag  !== 'all' && t.tag      !== filterTag)  return false
          if (filterPrio !== 'all' && t.priority !== filterPrio) return false
          if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
          return true
        })
      },

      getStats: () => {
        const { tasks } = get()
        const today = new Date().toISOString().split('T')[0]
        return {
          total:    tasks.length,
          done:     tasks.filter(t=>t.col==='done').length,
          progress: tasks.filter(t=>t.col==='progress').length,
          overdue:  tasks.filter(t=>t.date&&t.date<today&&t.col!=='done').length,
          hours:    parseFloat(tasks.reduce((a,t)=>a+t.logged,0).toFixed(1)),
          estHours: tasks.reduce((a,t)=>a+t.est,0),
        }
      },
    }),
    { name:'taskflow-v1', version:2 }
  )
)
