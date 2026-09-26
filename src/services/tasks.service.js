const pool = require('../config/db')
const { validateStatusTransition } = require('../validators/task.validator')

async function getTasksService (status) {

    if (status === undefined) {
            const result = await pool.query('SELECT * FROM tasks')
            return result.rows

        } 

        const result = await pool.query('SELECT * FROM tasks WHERE status = $1', [status])
        return result.rows
        
}

async function createTasksService (name, description, duration_days, dueDate, priority) {

    const result = await pool.query('INSERT INTO tasks (name, description, duration_days, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, duration_days, dueDate, priority])
        return result.rows[0]

}

async function statusUpdate (){

        const result = await pool.query(`UPDATE tasks SET status = 'incomplete' WHERE due_date < CURRENT_TIMESTAMP AND status != 'completed' RETURNING *`)
        return result.rows
    
}

async function updateTasksStatus (id, campos){
 
        const { name, description, priority, status } = campos
        const fields = []
        const values = []

        if (name === undefined && description === undefined && priority === undefined && status === undefined) {
            const error = new Error('No hay campos para actualizar')
            error.statusCode = 400
            throw error

        }

        if (name !== undefined && name!== null) {
            fields.push(`name = $${values.length + 1}`)
            values.push(name)

        }

        if (description !== undefined && description!== null) {
            fields.push(`description = $${values.length + 1}`)
            values.push(description)

        }

        if (priority !== undefined && priority!== null) {
            fields.push(`priority = $${values.length + 1}`)
            values.push(priority)

        }
    
        if (status !== undefined && status!== null) {
            const statusBD = await pool.query('SELECT status FROM tasks WHERE id = $1', [id])

            if (statusBD.rows.length === 0) {
                return undefined
            }

            const currentStatus = statusBD.rows[0].status

            if (validateStatusTransition(currentStatus, status)) {
                fields.push(`status = $${values.length + 1}`)
                values.push(status)
            } else {
                const error = new Error('Cambio de estado no permitido')
                error.statusCode = 400
                throw error               
            }        
        }

        values.push(id)

        const query = (`UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`)
        const result = await pool.query(query, values)
        return result.rows[0]
    
}

async function deleteTaskId(id) { 

        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id])
        return result.rows[0]

}


module.exports = { getTasksService, createTasksService, statusUpdate, updateTasksStatus, deleteTaskId }



//VERSIÓN 1 updateTasksStatus
/*async function updateTasksStatus (id, name, description, priority, status){
    try {

        console.log(id, name, description, priority, status)

        const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id])

        return result.rows[0]

    } catch (error){

        throw error
    }
    
}*/