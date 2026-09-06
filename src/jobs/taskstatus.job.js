const { statusUpdate } = require('../services/tasks.service')

setInterval(async () => {
    const result = await statusUpdate()

    if (result.length > 0) {

        console.log('Tareas actualizadas:', result)

    } else {
        console.log('No hay status actualizados')
    }

}, 10*1000)


