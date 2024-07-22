import { Request, Response } from 'express'
import { comparePasswords, createJWT, hashPassword } from '../modules/auth'
import prisma from '../db'

export const createUser = async (req: Request, res: Response, next: any) => {
    try {
        const isUserExist = await prisma.user.findUnique({
            where: { email: req.body.email },
        })
        if (isUserExist) {
            return res.status(400).json({ error: 'User already exist' })
        }
        const hash = await hashPassword(req.body.password)
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hash,
                email: req.body.email,
                isActive: true,
            },
        })

        const token = createJWT(user)
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500)
        next(error)
    }
}

export const loginUser = async (req: Request, res: Response, next: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email },
        })
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }
        const isValid = await comparePasswords(req.body.password, user.password)
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid password' })
        }
        const token = createJWT(user)
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500)
        next(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email },
        })
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }
        await prisma.user.delete({
            where: { email: req.body.email },
        })
        res.json({ message: 'User deleted' })
    } catch (error) {
        console.error(error)
        res.status(500)
        next(error)
    }
}
