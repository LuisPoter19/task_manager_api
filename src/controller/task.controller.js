const pool = require('../config/db')
const {updateTasksStatus, deleteTaskId} = require('../services/tasks.service') 

exports.getTasks = async (req, res) => {
    try {
        const status = req.query.status

        if (!status) {
            const result = await pool.query('SELECT * FROM tasks')
            res.json(result.rows)
        } else {
            const validStatuses = ['pending', 'in_progress', 'completed', 'incomplete']

            if (validStatuses.includes(status)) {
                const result = await pool.query('SELECT * FROM tasks WHERE status = $1', [status])
                res.json(result.rows)
            } else {
                return res.status(400).json({ message: 'Estado no válido. Los estados permitidos son pending, in_progress, completed e incomplete'})
            }         
        }

    }catch(error) {
        console.error(error.message)
        return res.status(500).json({
            message: 'Error al obtener las tareas'
        })

    }
    
} 

exports.createTasks = async (req, res) => {
    try{
        const { name, description, duration_days, priority } = req.body

        if (!name || name.trim().length === 0) {

            console.log('Nombre obligatorio')
            
            return res.status(400).json({ message: 'El nombre es obligatorio' })

        }

        if (name.trim().length < 3 || name.trim().length > 100) {
            return res.status(400).json({ message: 'El nombre debe tener entre 3 y 100 caracteres' })
        }

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ message: 'La descripción es obligarotia' })
        } 

        if (description.trim().length < 5 || description.trim().length > 255) {
            return res.status(400).json({ message: 'La descripción debe tener entre 5 y 255 caracteres' })

        }

        if (!duration_days || typeof duration_days !== 'number' || !Number.isInteger(duration_days) || duration_days <= 0) {
            return res.status(400).json({ message: 'Error:La duración de días es obligarotio. Comprueba qué sea un número, sea entero y mayor a 0'})
        }

        const validPriorities = ['low', 'medium', 'high']

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Error: Las prioridades disponibles son low, medium, high' })

        }

        const createdAt = new Date()
        const dueDate = new Date(createdAt)

        dueDate.setDate(createdAt.getDate() + duration_days)

        const result = await pool.query('INSERT INTO tasks (name, description, duration_days, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                name, description, duration_days, dueDate, priority
            ]
        )

        res.status(201).json(result.rows[0])

    }catch(error) {
        console.error(error.message)

        return res.status(500).json({ message: 'Error interno del servidor' })
    }
    
}

exports.updateTasks = async (req, res) => {
    try {

        const id = Number(req.params.id)
        const {name, description, priority, status} = req.body

        console.log(id)
        console.log(status)

        const validPriority= ["low", "medium", "high"]
        const validStatus = ["pending", "in_progress", "completed", "incomplete"]

        if (!name && !description && !priority && !status) {

            return res.status(400).json({ message: 'Error: No hay ningún campo para modificar' })

        }

        /*if (name !== undefined) {

            if (name.trim().length === 0 || name < 3 || name > 100) {
                res.status(400)
            }

        }*/

        if (priority && !validPriority.includes(priority)) {

            return res.status(400).json({ message: 'Error: Las prioridades disponibles son low, medium, high'})

        }

        if (status && !validStatus.includes(status)) {
            console.log(status)
            return res.status(400).json({ message: 'Error: Los status disponibles son pending, in_progress, completed, incomplete'})
        }


        if (typeof(id) !== "number" || !Number.isInteger(id) || id <= 0 ) {
            console.log(id)
            return res.status(400).json({ message: 'Error: El id ingresado debe ser un número entero mayor a 0'})
        }

        const result = await updateTasksStatus(id, name, description, priority, status)

        if (!result) {

            return res.status(404).json({ message: 'Tarea no encontrada'})      
        }

         return res.status(200).json(result)

    } catch (error) {
        console.error(error.message)

        return res.status(500).json({ message: 'Error al actualizar la tarea' })
    }
}

exports.deleteTasks = async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({ message: 'Error: Debes ingresar un Id valido' })

        }

        const result = await deleteTaskId(id)

        if (!result) {

            return res.status(404).json({ message: 'Error: El recurso solicitado no exxiste'})
           
        }

        return res.status(200).json({ message: 'Tarea eliminada correctamente', result })

    } catch (error) {
        console.log(error.message)

        return res.status(500).json( { message: 'Error: Ocurrio un problema inesperado'})
    }

}


//PRIMERA VERSIÓN DE UPDATE.TASKS
/*exports.updateTasks = async (req, res) => {
    try {

        const id = Number(req.params.id)
        const {status} = req.body

        const validStatus = ["pending", "in_progress", "completed", "incomplete"]

        if (!status || !validStatus.includes(status)) {

            return res.status(400).json({ message: 'Error: Ingresa el status. Los status disponibles son pending, in_progress, completed, incomplete'})
        }

        if (typeof(id) !== "number" || !Number.isInteger(id) || id <= 0 ) {
            return res.status(400).json({ message: 'Error: El id ingresado debe ser un número entero mayor a 0'})
        }

        const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id])

        if (result.rows.length === 0) {

            return res.status(404).json({ message: 'Tarea no encontrada'})      
        }

         return res.status(200).json(result.rows[0])

    } catch (error) {
        console.error(error.message)

        return res.status(500).json({ message: 'Error al actualizar la tarea'})
    }
}*/

//SEGUNDA VERSIÓN DE UPDATE.TASKS
/*exports.updateTasks = async (req, res) => {
    try {

        const id = Number(req.params.id)
        const {status} = req.body

        console.log(id)
        console.log(status)


        const validStatus = ["pending", "in_progress", "completed", "incomplete"]

        if (!status || !validStatus.includes(status)) {
            console.log(status)
            return res.status(400).json({ message: 'Error: Ingresa el status. Los status disponibles son pending, in_progress, completed, incomplete'})
        }

        if (typeof(id) !== "number" || !Number.isInteger(id) || id <= 0 ) {
            console.log(id)
            return res.status(400).json({ message: 'Error: El id ingresado debe ser un número entero mayor a 0'})
        }

        const result = await updateTasksStatus(id, status)

        //const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id])

        if (!result) {

            return res.status(404).json({ message: 'Tarea no encontrada'})      
        }

         return res.status(200).json(result)

    } catch (error) {
        console.error(error.message)

        return res.status(500).json({ message: 'Error al actualizar la tarea' })
    }
}*/