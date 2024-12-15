'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github } from 'lucide-react'
import { signIn,getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from "sonner"


export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const router = useRouter()

  const toggleMode = () => setIsLogin(!isLogin)

  // Handle form submission (login/signup)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLogin) {
      // Login using NextAuth credentials provider
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        alert('Login failed. Please try again.')
      } else {
        const session = await getSession()
        console.log('Session Token:', session?.token)  // Log the token
        router.push('/') // Redirect after login
      }
    } else {
      // Call the signup API and then log the user in automatically
      handleSignup()
    }
  }
  const githubSignup = async () => {
    try {
        const result=await signIn('github')
        
        if (result?.error) {
            alert('Login failed. Please try again.')
          } else {
            const session = await getSession()
            console.log('Session Token:', session?.token)  // Log the token
            // router.push('/') // Redirect after login
          }
    } catch (error) {
        console.error('Error:', error)
    }
  
  }

  const handleSignup = async () => {
    try {
      const response = await axios.post('/api/signup', {
        userName: formData.name,
        email: formData.email,
        password: formData.password,
      })

      const data = response.data
      // After signup, automatically log the user in
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (loginResult?.error) {
        alert('Signup successful, but login failed. Please try again.')
      } else {
        const session = await getSession()
        console.log('Session Token:', session?.token)  // Log the token
        router.push('/subjects') // Redirect after login
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      alert('Signup failed. Please try again.')
    }
  }

  // Update form data state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              className="mt-1 w-full"
            />
          </div>
        )}
        <div>
          <Label htmlFor="email" className="text-sm font-medium ">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-sm font-medium ">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Button type="submit" className="w-full">
            {isLogin ? 'Sign in' : 'Sign up'}
          </Button>
        </div>
      </form>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-900 rounded ">Or continue with</span>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={githubSignup}>
            <Github className="w-4 h-4 mr-2" />
            Sign up with GitHub
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm ">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button onClick={toggleMode} className="font-medium text-indigo-600 hover:text-indigo-500">
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
