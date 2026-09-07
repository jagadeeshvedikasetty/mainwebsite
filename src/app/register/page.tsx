import Link from 'next/link'
import { signup } from '../login/actions'
import '../login/login.css'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        {/* Toggle / Tabs */}
        <div className="auth-tabs">
          <Link href="/login" className="auth-tab">Log In</Link>
          <Link href="/register" className="auth-tab active">Register</Link>
        </div>

        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join Janani Home Foods to track your orders easily.</p>
        </div>
        
        <form className="auth-form" action={signup}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
            />
          </div>

          {searchParams?.message && (
            <div className="auth-error">
              {searchParams.message}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
