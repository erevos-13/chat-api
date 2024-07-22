import { Router } from 'express'
import { validate } from '../modules/middleware'
import { body } from 'express-validator'
import { createUser, deleteUser, loginUser } from '../handlers/auth'

const router = Router()

router.post(
    '/create-user',
    validate([
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
        body('email').isEmail().notEmpty(),
    ]),
    createUser,
)

router.post(
    '/login',
    validate([
        body('password').isString().notEmpty(),
        body('email').isEmail().notEmpty(),
    ]),
    loginUser,
)

router.delete(
    '/user',
    validate([body('email').isEmail().notEmpty()]),
    deleteUser,
)
export default router
