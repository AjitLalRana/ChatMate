




const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service")


function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        cors: {
     origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
    })

    io.use(async (socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Authentication error: No token provided"));
        }

        try {

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            socket.user = user

            next()

        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }

    })

    io.on("connection", (socket) => {
        console.log(`User connected : ${socket.id}`);
        socket.on("ai-message", async (messagePayload) => {
            /* messagePayload = { chat:chatId,content:message text } */
            const [ message, vectors ] = await Promise.all([
                messageModel.create({
                    chatId: messagePayload.chatId,
                    userId: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                }),
                aiService.generateVector(messagePayload.content),
            ])

            console.log(vectors)

            


            const [ memory, chatHistory ] = await Promise.all([

                queryMemory({
                    queryVector: vectors,
                    limit: 5,
                    metadata: {
                        userId: socket.user._id
                    }
                }),

                messageModel.find({
                    chatId: messagePayload.chatId
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            await createMemory({
                vectors :vectors,
                messageId: message._id,
                metadata: {
                    chatId: messagePayload.chatId,
                    userId: socket.user._id,
                    text: messagePayload.content
                }
            })

            console.log(chatHistory)

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [ { text: item.content } ]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [ {
                        text: `these are some previous messages from the chat, use them to generate a response${memory.map(item => item.metadata.text).join("\n")}
                        ` } ]
                }
            ]

            console.log("ltm =   ",...ltm);
            console.log("stm =   ",...stm);



            const response = await aiService.generateResponse([ ...ltm, ...stm ])




            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

            const [ responseMessage, responseVectors ] = await Promise.all([
                messageModel.create({
                    chatId: messagePayload.chatId,
                    userId: socket.user._id,
                    content: response,
                    role: "model"
                }),
                aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chatId: messagePayload.chatId,
                    userId: socket.user._id,
                    text: response
                }
            })

        })

    })
}


module.exports = initSocketServer;