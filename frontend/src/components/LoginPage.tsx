import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import { AuthForm } from './AuthForm'

export function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        toast.success('Successfully entered the Forge.', {
          id: 'login-success',
        })
        navigate('/')
      } else if (response.status === 401) {
        toast.error('Invalid email or password.', {
          id: 'login-error',
        })
      } else {
        const data = await response.json().catch(() => ({}))
        const errorMessage = data.error || 'Login failed.'
        toast.error(`Error during login: ${errorMessage}`, {
          id: 'login-error',
        })
      }
    } catch {
      toast.error('Network error during login.', {
        id: 'login-error',
      })
    }
  }

  return (
    <AuthForm
      title="Enter the Forge"
      subtitle="Sign In"
      submitText="Sign In"
      loadingText="Authenticating..."
      onSubmit={handleLogin}
      alternateLinkText={
        <>
          <UserPlus size={14} />
          Don't have an account? Sign Up
        </>
      }
      alternateLinkTo="/signup"
    />
  )
}
