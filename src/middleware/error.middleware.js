const errorHandler = (error, req, res, next) => {

    console.error(error.message)

    const statusCode = error.statusCode || 500

    return res.status(statusCode).json({ message: error.statusCode ? error.message : 'Error interno del servidor'})
}

module.exports = errorHandler