import Link from 'next/link'
import { login } from './actions'
import './login.css'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        {/* Toggle / Tabs */}
        <div className="auth-tabs">
          <Link href="/login" className="auth-tab active">Log In</Link>
          <Link href="/register" className="auth-tab">Register</Link>
        </div>

        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in.</p>
        </div>
        
        <form className="auth-form" action={login}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <Link href="/reset-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          {searchParams?.message && (
            <div className="auth-error">
              {searchParams.message}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link href="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
