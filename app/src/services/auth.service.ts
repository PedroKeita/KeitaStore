import type { User } from '@/types'

const MOCK_USER: User = {
    id: '1',
    name: 'Pedro Teste',
    email: 'pedro.teste@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=8'
}

export const authService = {
    async loginWithGoogle(): Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_USER)
            }, 1500)
        })
    },

    async logout(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 300)
        })
    },
}