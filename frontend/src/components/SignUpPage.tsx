import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import posthog from 'posthog-js'
import { AuthForm } from './AuthForm'

export function SignUpPage() {
  const navigate = useNavigate()

  const handleSignUp = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })


      if (response.ok) {
        posthog.capture('user_signed_up', { email })
        toast.success('Registration successful! Please check your email to confirm your account.', {
          id: 'signup-success',
          duration: 6000,
        })
        navigate('/')
      } else if (response.status === 409) {
        toast.error('A user with this email already exists.', {
          id: 'signup-error',
        })
      } else {
        const data = await response.json().catch(() => ({}))
        const errorMessage = data.error || 'Registration failed.'
        toast.error(`Error during registration: ${errorMessage}`, {
          id: 'signup-error',
        })
      }
    } catch (err) {
      console.error("FATAL ERROR IN SIGNUP TRY BLOCK:", err)
      toast.error('Network error during registration.', {
        id: 'signup-error',
      })
    }
  }

  return (
    <AuthForm
      title="Join the Forge"
      subtitle="Create an Account"
      submitText="Create Account"
      loadingText="Forging..."
      onSubmit={handleSignUp}
      alternateLinkText={
        <>
          <LogIn size={14} />
          Already have an account? Sign In
        </>
      }
      alternateLinkTo="/login"
    />
  )
}
