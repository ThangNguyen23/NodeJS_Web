import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auths.js"
import handler from "./handler.js";
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log('connected to mongoose')
    }).catch(err => {
        throw err
    })
}

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/api/auths', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/comments', commentRoutes)

app.use(handler)

app.listen(7000, () => {
    connect()
    console.log('connected')
})