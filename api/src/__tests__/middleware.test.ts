import { describe, it, expect, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/auth.js'
import type { AuthRequest } from '../middleware/auth.js'
import type { Response, NextFunction } from 'express'

const JWT_SECRET = 'test_secret'

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  return res as unknown as Response
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction
}

describe('Middleware — authMiddleware', () => {
  it('deve chamar next() com token válido', () => {
    process.env.JWT_SECRET = JWT_SECRET
    const token = jwt.sign({ userId: 'abc123' }, JWT_SECRET)

    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as AuthRequest

    const res = mockRes()
    const next = mockNext()

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.userId).toBe('abc123')
  })

  it('deve retornar 401 sem token', () => {
    const req = { headers: {} } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('deve retornar 401 com token inválido', () => {
    process.env.JWT_SECRET = JWT_SECRET
    const req = {
      headers: { authorization: 'Bearer token_invalido' },
    } as AuthRequest

    const res = mockRes()
    const next = mockNext()

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' })
    expect(next).not.toHaveBeenCalled()
  })
})