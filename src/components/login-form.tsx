import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface LoginFormProps extends React.ComponentProps<'div'> {
  onLogin: (username: string, password: string) => Promise<boolean>
  // Added onSignUp
  onSignUp: (username: string, password: string) => Promise<boolean>
}

export function LoginForm({ className, onLogin, onSignUp, ...props }: LoginFormProps) {
  // Added a state to toggle between Login and Sign Up mode
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (isSignUpMode) {
      // Handle the Sign Up
      const ok = await onSignUp(username, password)
      if (!ok) {
        setError('Failed to create account. Password must be at least 6 characters.')
      } else {
        setSuccess('Account created! You can now log in.')
        setIsSignUpMode(false) // Switch back to login view automatically
        setPassword('') // Clear password
      }
    } else {
      // Handle normal Login
      const ok = await onLogin(username, password)
      if (!ok) {
        setError('Invalid email or password')
      }
    }
  }

  // Toggle function
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignUpMode(!isSignUpMode)
    setError('')
    setSuccess('')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{isSignUpMode ? 'Create an account' : 'Login to your account'}</CardTitle>
          <CardDescription>
            {isSignUpMode ? 'Enter your details to register' : 'Enter your email below to login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='username'>Email</FieldLabel>
                <Input
                  id='username'
                  type='email' // Changed to email type for better mobile keyboards
                  placeholder='admin@example.com'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  {!isSignUpMode && (
                    <a
                      href='#'
                      className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {error && (
                <FieldDescription className='text-red-500 text-center font-medium'>
                  {error}
                </FieldDescription>
              )}
              {success && (
                <FieldDescription className='text-green-600 text-center font-medium'>
                  {success}
                </FieldDescription>
              )}

              <Field>
                <Button type='submit'>
                  {isSignUpMode ? 'Sign Up' : 'Login'}
                </Button>
                
                {/* Keep Google button only on Login mode if you want, or leave it for both */}
                {!isSignUpMode && (
                  <Button variant='outline' type='button'>
                    Login with Google
                  </Button>
                )}

                <FieldDescription className='text-center'>
                  {isSignUpMode ? (
                    <>Already have an account? <a href='#' onClick={toggleMode} className="underline">Log in</a></>
                  ) : (
                    <>Don&apos;t have an account? <a href='#' onClick={toggleMode} className="underline">Sign up</a></>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}