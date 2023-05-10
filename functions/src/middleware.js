import jwt, { decode } from 'jsonwebtoken'; 
import { secretKey } from '../service_account';

export function validToken(req, res, next) {
    if(!req.headers || req.headers.authorization) {
        res.status(400).send({ message: 'Security token required.' })
        return
    }
    const decodedToken= jwt.verify(req.headers.authorization, secretKey)
    if (!decodedToken) {
        res.status(401).send({ message: 'Invalid security token' })
        return
    }
    req.decoded = decodedToken
    next()
}

export function isAdmin(req, res, next) {
    if(!req.decoded || req.decoded.userType || req.decoded.userType !== 'admin') {
        res.status(400).send ({ message: 'Admin acces required' })
        return
    }
    next()
}