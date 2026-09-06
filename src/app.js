/*const express = require('express')
const app = express()


app.use(express.json())

const PORT = process.env.PORT || 3030

async function startServer(){
    try{
        await new Promise((resolve, reject) => {
            const server = app.listen(PORT, () => {
            console.log('Servidor corriendo')
            resolve()
        })

        server.on('error', (error) => {
            reject(error)
        })       
    })

    } catch(error) {
        console.error('Error al iniciar el servidor')
        console.error(error.message)
    }
}

app.get('/', (req, res) => {
    res.json({message: 'Task Manager API funcionando'})
})

startServer()*/

require('dotenv').config()
const express = require('express')
const app = express()
const taskRouter = require('./routes/task.routes')
const pool = require('../src/config/db')


app.use(express.json())
app.use('/api/tasks', taskRouter)

//require('./jobs/taskstatus.job')

const PORT = process.env.PORT || 3030

async function connectDB() {
    try {
        const result = await pool.query('SELECT NOW()')
        console.log('Postgres conectado')
        return true
    } catch (error) {
        console.error('Error de conexión')
        console.error(error.message)
        return false
    }
}

async function startServer() {
    const connected = await connectDB()
    if (connected){
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
    console.log(`http://localhost:${PORT}`)
    })
    } 
} 

startServer()


/*app.get('/', (req, res) => {
    res.json({message: 'Task Manager API funcionando'})
})

app.get('/api/tasks', (req, res) => {
    res.json({message: 'Lista de tareas'})
})*/
