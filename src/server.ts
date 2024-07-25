import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Server } from 'socket.io'
import http from 'http'
import routersAuth from './routes/auth'
import routersUser from './routes/user'
import { protect } from './modules/auth'
import { storeMessage } from './handlers/message'
import model from './genimi-api'
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
io.use((socket, next) => {
    const username = socket.handshake.auth?.token
    if (!username) {
        return next(new Error('invalid username'))
    }
    socket['username'] = username
    next()
})
io.on('connection', (socket) => {
    console.log('a user connected')
    socket.emit('connect-to-app', {
        message: 'a new client connected',
        userID: socket.id,
        socketId: socket.id,
    })
    socket.on("chat_message", async({content}) => {
        // await storeMessage(content,socket.id, to)

        const result = await model.chat.completions.create({
            messages: [{
                role: 'system',
                content: content,
            }],
            max_tokens: 60,
            temperature: 0.7,
            model: 'gpt-3.5-turbo',
        })
        console.log(result.choices[0].message.content, socket.id)
        socket.emit("send-message", {
            content: result.choices[0].message.content,
        });
    });

    socket.to('room').emit('message', 'hello room')


    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


export default server
