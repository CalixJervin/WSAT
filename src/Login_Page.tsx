import { LoginForm } from '@/components/login-form'

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>
  // Added onSignUp to the interface
  onSignUp: (username: string, password: string) => Promise<boolean>
}

export default function LoginPage({ onLogin, onSignUp }: LoginPageProps) {
  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold'>Employee Portal</h1>
          <p className='text-sm text-gray-500'>Sign in to manage attendance and shifts</p>
        </div>
        {/* Pass both functions to the form */}
        <LoginForm onLogin={onLogin} onSignUp={onSignUp} />
      </div>
    </div>
  )
}