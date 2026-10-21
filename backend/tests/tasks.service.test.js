/*jest.mock('../src/config/db', () => ({
    query: jest.fn()
}))*/

jest.mock('../src/config/db', () => ({
    query: jest.fn(),
    connect: jest.fn()
}))

const pool = require('../src/config/db')
const { getTasksService, createTasksService, statusUpdate, deleteTaskId, updateTasksStatus } = require('../src/services/tasks.service')

describe('getTasksService', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe devolver las tareas y el total sin filtro de estado', async () => {

        const tasks = [
            { id: 1, name: 'Tarea 1', status: 'pending' },
            { id: 2, name: 'Tarea 2', status: 'completed' }
        ]

        pool.query
            .mockResolvedValueOnce({ rows: tasks })
            .mockResolvedValueOnce({ rows: [{ cantidad: '2' }] })

        const result = await getTasksService(undefined, 10, 0)

        expect(result).toEqual({
            data: tasks,
            total: 2
        })

        expect(pool.query).toHaveBeenCalledTimes(2)
    })

    test('Debe devolver las tareas filtradas por estado', async () => {
        const tasks = [
            { id: 1, name: 'Tarea pendiente', status: 'pending' }
        ]

        pool.query
            .mockResolvedValueOnce({ rows: tasks })
            .mockResolvedValueOnce({ rows: [{ cantidad: '3' }] })

        const result = await getTasksService('pending', 10, 0)

        expect(result).toEqual({
            data: tasks,
            total: 3
        })

        expect(pool.query).toHaveBeenCalledTimes(2)

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('WHERE status = $1'),
            ['pending', 10, 0]
        )

        expect(pool.query).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('WHERE status = $1'),
            ['pending']
        )
    })
    test('Debe devolver una lista vacía cuando no hay tareas', async () => {
    pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ cantidad: '0' }] })

    const result = await getTasksService(undefined, 10, 0)

    expect(result).toEqual({
        data: [],
        total: 0
    })

    expect(pool.query).toHaveBeenCalledTimes(2)
})
})

describe('createTasksService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe devolver la tarea creada', async () => {
        const dueDate = new Date('2026-10-24T10:00:00Z')

        const task = {
            id: 1,
            name: 'Tarea de prueba',
            description: 'Descripción de prueba',
            duration_days: 5,
            due_date: dueDate,
            priority: 'medium',
            status: 'pending'
        }

        pool.query.mockResolvedValueOnce({
            rows: [task]
        })

        const result = await createTasksService(
            'Tarea de prueba',
            'Descripción de prueba',
            5,
            dueDate,
            'medium'
        )

        expect(result).toEqual(task)
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO tasks'),
            [
                'Tarea de prueba',
                'Descripción de prueba',
                5,
                dueDate,
                'medium'
            ]
        )
    })
})

describe('statusUpdate', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe devolver las tareas cuyo estado fue actualizado', async () => {
        const tasks = [
            { id: 1, name: 'Tarea vencida', status: 'incomplete' },
            { id: 2, name: 'Otra tarea vencida', status: 'incomplete' }
        ]

        pool.query.mockResolvedValueOnce({
            rows: tasks
        })

        const result = await statusUpdate()

        expect(result).toEqual(tasks)
        expect(pool.query).toHaveBeenCalledTimes(1)

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("SET status = 'incomplete'")
        )
    })
})

describe('deleteTaskId', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe devolver la tarea eliminada', async () => {
        const task = {
            id: 1,
            name: 'Tarea eliminada',
            status: 'pending'
        }

        pool.query.mockResolvedValueOnce({
            rows: [task]
        })

        const result = await deleteTaskId(1)

        expect(result).toEqual(task)

        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [1]
        )
    })

    test('Debe devolver undefined cuando la tarea no existe', async () => {
    pool.query.mockResolvedValueOnce({
        rows: []
    })

    const result = await deleteTaskId(999)

    expect(result).toBeUndefined()

    expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        [999]
    )
})
})

describe('updateTasksStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Debe actualizar el nombre de una tarea', async () => {
        const task = {
            id: 1,
            name: 'Nombre actualizado',
            description: 'Descripción de prueba',
            priority: 'medium',
            status: 'pending'
        }

        const client = {
            query: jest.fn(),
            release: jest.fn()
        }

        pool.connect.mockResolvedValueOnce(client)

        // Simular BEGIN
        client.query.mockResolvedValueOnce({ rows: [] })

        // Simular UPDATE
        client.query.mockResolvedValueOnce({
            rows: [task]
        })

        const result = await updateTasksStatus(1, {
            name: 'Nombre actualizado'
        })

        expect(result).toEqual(task)

        expect(client.query).toHaveBeenCalledWith('BEGIN')

        expect(client.query).toHaveBeenCalledWith(
            'UPDATE tasks SET name = $1 WHERE id = $2 RETURNING *',
            ['Nombre actualizado', 1]
        )

        expect(client.query).toHaveBeenCalledWith('COMMIT')

        expect(client.release).toHaveBeenCalled()
    })
})