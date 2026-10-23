import './App.css'
import { useState, useEffect } from "react"

function App() {
  
const [tasks, setTasks] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [statusFilter, setStatusFilter] = useState('all')

const filteredTasks = statusFilter === 'all'
  ? tasks
  : tasks.filter((task) => task.status === statusFilter)

useEffect(() => {
  const getTasks = async () => {
    try {
      const response = await fetch('http://localhost:3030/api/tasks')

      if (!response.ok) {
        throw new Error('No fue posible obtener las tareas')
      }

      const result = await response.json()

      setTasks(result.data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  getTasks()
}, [])

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="brand">Task Manager</h2>

        <nav>
          <a href="#dashboard" className="nav-link active">
            <span>▦</span> Dashboard
          </a>

          <a href="#tasks" className="nav-link">
            <span>☷</span> Mis tareas
          </a>

          <a href="#settings" className="nav-link">
            <span>⚙</span> Configuración
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">LM</span>
          <div>
            <strong>Mi perfil</strong>
            <small>Administrador</small>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Organiza tus tareas y alcanza tus objetivos.</p>
          </div>

          <button className="primary-button">
            + Nueva tarea
          </button>
        </header>

        <section className="summary">
          <article className="summary-card">
            <span className="card-label">Total de tareas</span>
            <strong className="card-number">24</strong>
            <span className="card-note">Todas tus tareas</span>
          </article>

          <article className="summary-card">
            <span className="card-label">Pendientes</span>
            <strong className="card-number">10</strong>
            <span className="card-note">Por comenzar</span>
          </article>

          <article className="summary-card">
            <span className="card-label">En progreso</span>
            <strong className="card-number">8</strong>
            <span className="card-note">Actualmente activas</span>
          </article>

          <article className="summary-card">
            <span className="card-label">Completadas</span>
            <strong className="card-number">6</strong>
            <span className="card-note">Tareas finalizadas</span>
          </article>
        </section>

        <section className="tasks-section" id="tasks">
          <div className="section-heading">
            <div>
              <h2>Mis tareas</h2>
              <p>Consulta y organiza tus actividades.</p>
            </div>

            <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filtrar tareas"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completadas</option>
                <option value="incomplete">Incompletas</option>
            </select>
          </div>

          <div className="task-list">
            {loading && <p>Cargando tareas...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && filteredTasks.length === 0 && (
              <p>No hay tareas para mostrar con este estado.</p>
            )}

            {!loading && !error && filteredTasks.map((task) => (
              <article className="task-row" key={task.id}>
                <div className="task-info">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                </div>

                <span className={`priority ${task.priority}`}>
                  {task.priority === 'high'
                    ? 'Alta'
                    : task.priority === 'medium'
                      ? 'Media'
                      : 'Baja'}
                </span>

                <span
                  className={`status ${
                    task.status === 'in_progress'
                      ? 'in-progress'
                      : task.status
                  }`}
                >
                  {task.status === 'pending'
                    ? 'Pendiente'
                    : task.status === 'in_progress'
                      ? 'En progreso'
                      : task.status === 'completed'
                        ? 'Completada'
                        : 'Incompleta'}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
