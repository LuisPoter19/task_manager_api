const errorHandler = (error, req, res, next) => {

    console.error(error.message)

    //const statusCode = error.statusCode || 500

    const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
        ? error.statusCode
        : 500

    return res.status(statusCode).json({ message: error.statusCode ? error.message : 'Error interno del servidor'})
}

module.exports = errorHandler