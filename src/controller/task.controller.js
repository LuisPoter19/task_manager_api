const {getTasksService, createTasksService, updateTasksStatus, deleteTaskId, testTransaction} = require('../services/tasks.service') 
const { validateName, validateDescription, validateDurationDays, validatePriority , validateStatus } = require('../validators/task.validator')

exports.getTasks = async (req, res, next) => {
    try {
        const limit = Number(req.query.limit ?? 10)
        const page = Number(req.query.page ?? 1)
        const status = req.query.status

        const offset = (page - 1) * limit
        
        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({ message: 'Los valores ingresados para page y limit son invalidos'})
        }


        if (status === undefined ) {
            const result = await getTasksService(status, limit, offset)
            return res.status(200).json(result)
        }   

        if (!validateStatus(status)) {
            return res.status(400).json({ message: 'Estado no válido. Los estados permitidos son pending, in_progress, completed e incomplete'})

        } 

        const result = await getTasksService(status, limit, offset)
        return res.status(200).json(result)

    }catch(error) {
        return next(error)

    }
    
} 

exports.createTasks = async (req, res, next) => {
    try{
        const { name, description, duration_days, priority } = req.body

        if (!validateName(name, true)) {
             return res.status(400).json({ message: 'Error: El nombre debe tener entre 3 y 100 caracteres' })

        }

        if (!validateDescription(description, true)) {
            return res.status(400).json({ message: 'Error: La descripción debe tener entre 5 y 255 caracteres' })

        }

        if (!validateDurationDays(duration_days, true)) {
             return res.status(400).json({ message: 'Error:La duración de días es obligarotio. Comprueba qué sea un número, sea entero y mayor a 0'})

        }

        if (!validatePriority(priority, true)) {
            return res.status(400).json({ message: 'Error: Las prioridades disponibles son low, medium, high' })
        
        }

        const normalizeName = name.trim()
        const normalizeDescription = description.trim()

        const createdAt = new Date()
        const dueDate = new Date(createdAt)

        dueDate.setDate(createdAt.getDate() + duration_days)

        const result = await createTasksService(normalizeName, normalizeDescription, duration_days, dueDate, priority)
        return res.status(201).json(result)

    }catch(error) {    
        return next(error)
    }
    
}

exports.updateTasks = async (req, res, next) => {
    try {

        const id = Number(req.params.id)
        const {name, description, priority, status} = req.body

        if (name === undefined && description === undefined && priority === undefined && status === undefined) {
            return res.status(400).json({ message: 'Error: No hay ningún campo para modificar' })

        }

        if (!validateName(name)) {
            return res.status(400).json({ message: 'Error: El nombre debe tener entre 3 y 100 caracteres' })

        }

        if (!validateDescription(description)) {
            return res.status(400).json({ message: 'Error: La descripción debe tener entre 5 y 255 caracteres' })

        }

        if (!validatePriority(priority)) {
            return res.status(400).json({ message: 'Error: Las prioridades disponibles son low, medium, high' })
        
        }

        if (!validateStatus(status)) {
            return res.status(400).json({ message: 'Error: Los status disponibles son pending, in_progress, completed, incomplete'})

        }

        if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0 ) {        
            return res.status(400).json({ message: 'Error: El id ingresado debe ser un número entero mayor a 0'})
        }

        const normalizeName = name !== undefined ? name.trim() : undefined
        const normalizeDescription = description !== undefined ? description.trim() : undefined

        const campos = {name: normalizeName, description: normalizeDescription, priority, status}

        const result = await updateTasksStatus(id, campos)

       // const result = await testTransaction(id)

        if (!result) {
            return res.status(404).json({ message: 'Tarea no encontrada'})      
        }

         return res.status(200).json(result)

    } catch (error) {        
        return next(error)
    }
}

exports.deleteTasks = async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Error: Debes ingresar un Id valido' })

        }

        const result = await deleteTaskId(id)

        if (!result) {
            return res.status(404).json({ message: 'Error: El recurso solicitado no exxiste'})
           
        }

        return res.status(200).json({ message: 'Tarea eliminada correctamente', result })

    } catch (error) {    
        return next(error)
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


//PRIMERA VERSIÓN DE GETTASKS
/*exports.getTasks = async (req, res, next) => {
    try {
        const status = req.query.status

        if (!status) {
            const result = await pool.query('SELECT * FROM tasks')
            return res.json(result.rows)
        } else {
            const validStatuses = ['', 'pending', 'in_progress', 'completed', 'incomplete']

            if (validStatuses.includes(status)) {
                const result = await pool.query('SELECT * FROM tasks WHERE status = $1', [status])
                return res.json(result.rows)
            } else {
                return res.status(400).json({ message: 'Estado no válido. Los estados permitidos son pending, in_progress, completed e incomplete'})
            }         
        }

    }catch(error) {
        console.error(error.message)
        return res.status(500).json({
            message: 'Error al obtener las tareas'     })

        

    }
    
}*/


//SEGUNDA VERSIÓN DE GETTASKS
/*exports.getTasks = async (req, res, next) => {
    try {
        const status = req.query.status

        if (status === undefined) {
            const result = await getTasksService()
            return res.status(200).json(result)
        }

        if (!validateStatus(status)) {
            return res.status(400).json({ message: 'Estado no válido. Los estados permitidos son pending, in_progress, completed e incomplete'})

        } 

        const result = await getTasksService(status)
        return res.status(200).json(result)

    }catch(error) {
        return next(error)

    }
    
}*/