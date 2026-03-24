import { describe, it, expect, beforeAll, afterAll} from 'vitest'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const JWT_SECRET = 'test_secret'

describe('Auth — JWT', () => {
  it('deve gerar um token válido', () => {
    const token = jwt.sign({ userId: 'abc123' }, JWT_SECRET, { expiresIn: '7d' })
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('deve decodificar o token corretamente', () => {
    const token = jwt.sign({ userId: 'abc123' }, JWT_SECRET)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    expect(decoded.userId).toBe('abc123')
  })

  it('deve rejeitar um token inválido', () => {
    expect(() => jwt.verify('token_invalido', JWT_SECRET)).toThrow()
  })

  it('deve rejeitar um token expirado', async () => {
    const token = jwt.sign({ userId: 'abc123' }, JWT_SECRET, { expiresIn: '1ms' })
    await new Promise(r => setTimeout(r, 10))
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow()
  })
})

describe('Auth — Banco de dados', () => {
  const testUser = {
    googleId: 'test_google_id_123',
    name: 'Usuário Teste',
    email: 'teste@keitastore.com',
    avatar: null,
  }

  beforeAll(async () => {
    // Limpa o usuário de teste antes de rodar
    await prisma.user.deleteMany({ where: { googleId: testUser.googleId } })
  })

  afterAll(async () => {
    // Limpa após os testes
    await prisma.user.deleteMany({ where: { googleId: testUser.googleId } })
    await prisma.$disconnect()
  })

  it('deve criar um usuário no banco', async () => {
    const user = await prisma.user.create({ data: testUser })
    expect(user.id).toBeTruthy()
    expect(user.email).toBe(testUser.email)
    expect(user.name).toBe(testUser.name)
  })

  it('deve encontrar o usuário pelo googleId', async () => {
    const user = await prisma.user.findUnique({ where: { googleId: testUser.googleId } })
    expect(user).not.toBeNull()
    expect(user?.email).toBe(testUser.email)
  })

  it('deve atualizar o nome do usuário', async () => {
    const updated = await prisma.user.update({
      where: { googleId: testUser.googleId },
      data: { name: 'Nome Atualizado' },
    })
    expect(updated.name).toBe('Nome Atualizado')
  })

  it('deve deletar o usuário', async () => {
    await prisma.user.delete({ where: { googleId: testUser.googleId } })
    const user = await prisma.user.findUnique({ where: { googleId: testUser.googleId } })
    expect(user).toBeNull()
  })
})