import { Request, Response } from 'express'
import prisma from '../db'
import { Prisma } from '@prisma/client'
type RequestWithUser = Request & {
    user: Prisma.PromiseReturnType<typeof prisma.user.findUnique>
}
export const getUser = async (
    req: RequestWithUser,
    res: Response,
    next: any,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' })
        }
        const user = await prisma.user.findUnique({
            where: { email: req.user.email },
            select: {
                id: true,
                username: true,
                email: true,
                isActive: true,
            },
        })
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }
        res.json({ user })
    } catch (error) {
        console.error(error)
        res.status(500)
        next(error)
    }
}
