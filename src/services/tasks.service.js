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

async function updateTasksStatus (id, status){
    try {

        const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id])

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
