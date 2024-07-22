import { sign, verify } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

export const createJWT = (user: any) => {
    const token = sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET as string,
    )
    return token
}

export const protect = (req: any, res: any, next: any) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        res.status(401)
        res.send('Not authorized')
        return
    }

    const [, token] = bearer.split(' ')
    if (!token) {
        console.log('here')
        res.status(401)
        res.send('Not authorized')
        return
    }

    try {
        const payload = verify(token, process.env.JWT_SECRET as string)
        req.user = payload
        console.log(payload)
        next()
        return
    } catch (e) {
        console.error(e)
        res.status(401)
        res.send('Not authorized')
        return
    }
}

export const comparePasswords = (password: any, hash: any) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password: any) => {
    return bcrypt.hash(password, 5)
}
