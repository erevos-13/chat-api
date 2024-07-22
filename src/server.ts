import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Server } from 'socket.io'
import http from 'http'
import routersAuth from './routes/auth'
import routersUser from './routes/user'
import { protect } from './modules/auth'
const app = express()

app.use(cors())
app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/api', routersAuth)

app.use('/api/user', protect, routersUser)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow all origins for simplicity; adjust as needed
    },
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.emit('connect-to-app', {
        message: 'a new client connected',
        socketId: socket.id,
    })

    socket.on('create-something', (msg) => {
        console.log('message: ' + msg)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

export default server