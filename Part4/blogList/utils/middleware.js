const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user")

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("Authorization")
    if (authorization && authorization.startsWith("bearer ")) {
        request.token = authorization.replace("bearer ", "")
    }

    next();
}

const userExtractor = async (request, response, next) => {

    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    }

    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({
            error: "malformated id"
        })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    } else if (error.name === "JsonWebTokenError") {
        return response.status(400).json({ error: error.message })
    }

    next(error);
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

const requestLogger = (request, response, next) => {
    logger.info("Method: ", request.method);
    logger.info("Path: ", request.path);
    logger.info("Body: ", request.body);
    logger.info("----");
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}