const { statusUpdate } = require('../services/tasks.service')

setInterval(async () => {

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
    
}, 10*1000)


