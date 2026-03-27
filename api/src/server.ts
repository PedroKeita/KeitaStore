import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000



app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://keita-store.vercel.app' 
  ],
  credentials: true
}))

app.use(express.json())
app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`)
})

export default app