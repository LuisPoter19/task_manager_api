const { statusUpdate } = require('../services/tasks.service')

function startTaskStatusJob() {
    const intervalId = setInterval(async () => {
        try {
            const result = await statusUpdate()

            if (result.length > 0) {
                console.log('Tareas actualizadas:', result)
            } else {
                console.log('No hay status actualizados')
            }
        } catch (error) {
            console.error('Error al ejecutar el Job:', error.message)
        }
    }, 10 * 1000)

    return intervalId
}

function stopTaskStatusJob(intervalId) {
    clearInterval(intervalId)
}

module.exports = { startTaskStatusJob,stopTaskStatusJob }






//-----VERSIÓN 1---------
/*setInterval(async () => {

    try {
        const result = await statusUpdate()

        if (result.length > 0) {

            console.log('Tareas actualizadas:', result)

        } else {
            console.log('No hay status actualizados')
        }

    } catch(error) {

        console.error('Error al iniciar el Job', error.message)
    }
    
}, 10*1000)*/


