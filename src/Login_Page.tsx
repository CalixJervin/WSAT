import { LoginForm } from '@/components/login-form'

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold'>Employee Portal</h1>
          <p className='text-sm text-gray-500'>Sign in to manage attendance and shifts</p>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  )
}

export default LoginPage
