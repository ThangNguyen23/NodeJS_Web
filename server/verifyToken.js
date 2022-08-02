import jwt from "jsonwebtoken"
import {createError} from "./error.js";
import handler from "./handler.js"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return handler('', req, res, createError(401, 'you are not authenticated'))
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return handler('', req, res, createError(403, 'token is not valid'))
        }
        req.user = user
        next()
    })
}