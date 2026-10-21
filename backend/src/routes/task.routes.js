const express = require('express')
const router = express.Router()
const taskController = require('../controller/task.controller')

router.get('/', taskController.getTasks)
router.post('/', taskController.createTasks)
router.patch('/:id', taskController.updateTasks)
router.delete('/:id', taskController.deleteTasks)

module.exports = router


//VERSION 1
/*router.get('/', (req, res) => {
    res.json({message: 'Task Manager API funcionando'})
})*/
