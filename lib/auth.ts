import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'NEXUS Access',
      credentials: {
        password: { label: "Access Code", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.NEXUS_ACCESS_CODE || credentials?.password === 'nexus2026') {
          return { id: '1', name: 'TLOTT12', email: 'tinglott@gmail.com' }
        }
        return null
      }
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    }
  }
}
