const request = require('supertest')
const app = require('../src/app')
const pool = require('../src/config/db')

afterAll(async () => {
    await pool.end()
})

describe('GET /api/tasks', () => {
    test('Debe responder 200 y devolver las tareas con su paginación', async () => {
        const response = await request(app).get('/api/tasks')

        expect(response.statusCode).toBe(200)

        expect(response.body).toHaveProperty('data')
        expect(Array.isArray(response.body.data)).toBe(true)

        expect(response.body).toHaveProperty('pagination')
        expect(response.body.pagination).toMatchObject({
            page: 1,
            limit: 10
        })

    
 })
})

 describe('POST /api/tasks', () => {
    

    test('Debe responder 400 cuando faltan los campos obligatorios', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({})

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe crear una tarea y responder 201', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea de prueba Jest',
                description: 'Descripción para prueba automatizada',
                duration_days: 5,
                priority: 'medium'
            })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.name).toBe('Tarea de prueba Jest')
        expect(response.body.status).toBe('pending')
    })

    
    test('Debe responder 400 cuando la duración es cero', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea de prueba',
                description: 'Descripción de prueba válida',
                duration_days: 0,
                priority: 'medium'
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    
    
})


describe('PATCH /api/tasks/:id', () => {
    test('Debe responder 400 cuando el estado no es válido', async () => {
        const response = await request(app)
            .get('/api/tasks?status=invalid')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe responder 400 al intentar reabrir una tarea completada', async () => {
        const creada = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea completada para prueba',
                description: 'Descripción de la tarea de prueba',
                duration_days: 5,
                priority: 'medium'
            })

        expect(creada.statusCode).toBe(201)

        const id = creada.body.id

        const completada = await request(app)
            .patch(`/api/tasks/${id}`)
            .send({
                status: 'completed'
            })

        expect(completada.statusCode).toBe(200)

        const response = await request(app)
            .patch(`/api/tasks/${id}`)
            .send({
                status: 'in_progress'
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe responder 400 cuando la prioridad no es válida', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea de prueba',
                description: 'Descripción de prueba válida',
                duration_days: 5,
                priority: 'urgent'
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe actualizar el nombre de una tarea existente', async () => {
        const creada = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea para actualizar',
                description: 'Descripción de la tarea de prueba',
                duration_days: 5,
                priority: 'medium'
            })

        expect(creada.statusCode).toBe(201)

        const id = creada.body.id

        const response = await request(app)
            .patch(`/api/tasks/${id}`)
            .send({
                name: 'Tarea actualizada con Jest'
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBe('Tarea actualizada con Jest')
    })


    test('Debe responder 400 cuando el ID no es válido', async () => {
        const response = await request(app)
            .patch('/api/tasks/abc')
            .send({
                name: 'Tarea actualizada'
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe responder 404 cuando la tarea no existe', async () => {
        const response = await request(app)
            .patch('/api/tasks/999999999')
            .send({
                name: 'Tarea actualizada con Jest'
            })

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe rechazar un estado inválido al actualizar una tarea', async () => {
    const task = await request(app)
        .post('/api/tasks')
        .send({
            name: 'Tarea para validar estado',
            description: 'Prueba de estado inválido',
            duration_days: 5,
            priority: 'medium'
        })

    const response = await request(app)
        .patch(`/api/tasks/${task.body.id}`)
        .send({
            status: 'cancelled'
        })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
})

})

describe('DELETE /api/tasks/:id', () => {
    test('Debe eliminar una tarea existente', async () => {
        const creada = await request(app)
            .post('/api/tasks')
            .send({
                name: 'Tarea para eliminar',
                description: 'Descripción de la tarea de prueba',
                duration_days: 5,
                priority: 'medium'
            })

        expect(creada.statusCode).toBe(201)

        const id = creada.body.id

        const response = await request(app)
            .delete(`/api/tasks/${id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe(
            'Tarea eliminada correctamente'
        )
    })

    test('Debe responder 404 cuando la tarea no existe', async () => {
        const response = await request(app)
            .delete('/api/tasks/999999999')

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('message')
    })

    test('Debe responder 400 cuando el ID no es válido', async () => {
    const response = await request(app)
        .delete('/api/tasks/abc')

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')

})
})