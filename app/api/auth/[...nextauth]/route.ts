declare module 'next-auth' {
  interface User {
    id: string
    accessToken: string
    client: string
    uid: string
    expiry?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    client?: string
    uid?: string
    expiry?: string
    id?: string
    email?: string
    name?: string
    picture?: string
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    client?: string
    uid?: string
    expiry?: string
    user?: {
      id?: number
      name?: string
      email?: string
      image?: string
      nickname?: string
      photo_url?: string
    }
  }
}

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            'http://127.0.0.1:3001/api/v1/auth/sign_in',
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          )

          const user = response.data.data
          user.accessToken = response.headers['access-token']
          user.client = response.headers['client']
          user.uid = response.headers['uid']

          return user
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const response = await axios.post(
            'http://127.0.0.1:3001/api/v1/auth/google_oauth2/callback',
            {
              omniauth: {
                provider: 'google',
                uid: profile?.sub,
                info: {
                  email: profile?.email,
                  name: profile?.name,
                  nickname: profile?.name,
                  image: profile?.image,
                },
                credentials: {
                  token: account.access_token,
                  refresh_token: account.refresh_token,
                  id_token: account.id_token,
                },
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              validateStatus: function (status) {
                return status >= 200 && status < 300
              },
            },
          )

          if (response.data?.status === 'success' && response.data?.data) {
            const responseData = response.data.data
            const tokens = {
              accessToken:
                response.headers['access-token'] ||
                responseData.tokens['access-token'],
              client:
                response.headers['client'] || responseData.tokens['client'],
              uid: response.headers['uid'] || responseData.tokens['uid'],
              expiry:
                response.headers['expiry'] || responseData.tokens['expiry'],
            }

            user.id = responseData.id
            user.accessToken = tokens.accessToken
            user.client = tokens.client
            user.uid = tokens.uid
            user.expiry = tokens.expiry

            return true
          } else {
            return false
          }
        } catch (error: any) {
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (!token) {
        token = {}
      }

      if (user && account) {
        token = {
          ...token,
          accessToken: user.accessToken,
          client: user.client,
          uid: user.uid,
          expiry: user.expiry,
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          picture: user.image ?? undefined,
        }
      }
      return token
    },

    async session({ session, token, user }) {
      if (!session) {
        session = {
          user: {},
          expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days from now
        }
      }

      if (!session.user) {
        session.user = {}
      }

      session.accessToken = token.accessToken
      session.client = token.client
      session.uid = token.uid
      session.expiry = token.expiry
      session.user.id = token.id ? Number(token.id) : undefined
      session.user.email = token.email
      session.user.name = token.name
      session.user.image = token.picture

      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
