import { LoginForm } from '@/components/login/loginForm'
import Image from 'next/image'


export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <Image
                className="h-full w-full object-cover"
                src="/login/moon.jpg"
                alt="Login background"
                width={600}
                height={600}
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to your account</h2>
              <p className="text-sm text-gray-600 mb-6">
                Or{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  start your 14-day free trial
                </a>
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

