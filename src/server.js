const app = require('./app')
const pool = require('../src/config/db')
const { startTaskStatusJob } = require('./jobs/taskstatus.job')

const PORT = process.env.PORT || 3030

async function startServer() {
    try {
        await pool.query('SELECT NOW()')
        console.log('Postgres conectado')

        startTaskStatusJob()

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`)
            console.log(`http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error.message)
        process.exitCode = 1
    }    
}

startServer()