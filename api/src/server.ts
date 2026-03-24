import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000



app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://keita-store.vercel.app' 
  ],
  credentials: true
}))

app.use(express.json())
app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})

export default app