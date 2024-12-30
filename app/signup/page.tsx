'use client'
import { useState } from 'react'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
      setError('Passwords do not match')
      return
    }

    try {
      await axios.post(
        'http://127.0.0.1:3001/api/v1/auth',
        {
          email,
          password,
          password_confirmation: passwordConfirmation,
          name,
          nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            confirm_success_url: `${window.location.origin}/calendars/new`,
          },
        },
      )

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/calendars/new')
      }
    } catch (err) {
      setError(
        (err as any).response?.data?.errors?.full_messages?.[0] ||
          'An error occurred',
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-foreground"
              >
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password-confirmation"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="bg-card"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
