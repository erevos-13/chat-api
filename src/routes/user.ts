import { Router } from 'express'
import { getUser } from '../handlers/user'

const router = Router()

router.get('/', getUser)

export default router
