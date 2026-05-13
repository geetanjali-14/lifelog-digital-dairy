import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

// Ensure NEXTAUTH_SECRET is set
const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key-min-32-characters-long'

export const authOptions: NextAuthOptions = {
  // @ts-ignore - Compatibility between @auth/prisma-adapter and next-auth v4
  adapter: PrismaAdapter(prisma) as Adapter,
  
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // Email/Password Provider (Credentials)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Incorrect password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        if (!profile?.email) {
          throw new Error('No email returned from Google')
        }
      }
      return true
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name
        session.user.image = token.picture as string
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      
      if (account?.provider) {
        token.provider = account.provider
      }
      
      return token
    },
  },

  pages: {
    signIn: '/signin', // Updated to match the refined page route
    signOut: '/auth/signout',
    error: '/signin', // Redirect back to signin on error
    verifyRequest: '/auth/verify',
    newUser: '/dashboard',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: secret,

  debug: process.env.NODE_ENV === 'development',
}
