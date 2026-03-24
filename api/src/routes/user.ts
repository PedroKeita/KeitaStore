import { Router, type Request, type Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios'})
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres'})
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email }})
        if (existing) {
            return res.status(409).json({ error: 'Email já cadastrado'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword},
        })

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
     })
    } catch {
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    })
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router