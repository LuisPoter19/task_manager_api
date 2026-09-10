const pool = require('../config/db')

async function statusUpdate (){
    try {

        //Pendiente actualizar para devolver solo el registro actualizado

        const result = await pool.query(`UPDATE tasks SET status = 'incomplete' WHERE due_date < CURRENT_TIMESTAMP AND status != 'completed' RETURNING *`)

        return result.rows

    } catch (error) {
        console.error(error)
        console.error('Error al actualizar los estados')
    }
    
}

async function updateTasksStatus (id, name, description, priority, status){
    try {

        const fields = []
        const values = []

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

            fields.push(`status = $${values.length + 1}`)
            values.push(status)

        }

        values.push(id)

        const query = (`UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`)

        const result = await pool.query(query, values)

        return result.rows[0]

    } catch (error){

        throw error
    }
    
}

async function deleteTaskId(id) {
    try {
        
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id])

        return result.rows[0]


    } catch (error){

        throw error

    }

}


module.exports = { statusUpdate, updateTasksStatus, deleteTaskId }



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