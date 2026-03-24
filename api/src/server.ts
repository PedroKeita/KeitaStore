import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173', credentials: true}))
app.use(express.join())

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`)
})

export default app