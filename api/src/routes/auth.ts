import { Router, type Request, type Response} from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const router = Router()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `https://keitastore-api.onrender.com/auth/google/callback`,
        },

        async (_accessToken, refreshToken, profile, done) => {
            try {
                const user = await prisma.user.upsert({
                    where: { googleId: profile.id },
                    update: {
                         avatar: profile.photos?.[0]?.value ?? null,
                    },
                    create: {
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value ?? '',
                        avatar: profile.photos?.[0]?.value ?? null,
                    },
                })
                done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)

// fluxo OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// callback google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=true` }),
  (req: Request, res: Response) => {
    const user = req.user as { id: string; name: string; email: string; avatar: string }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Redireciona para o frontend com o token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(user.avatar ?? '')}`)
  }
)

// retornar dados user
router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Não autenticado' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
})

export default router