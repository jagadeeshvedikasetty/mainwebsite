import Link from 'next/link'
import '../login/login.css'
import { resetPassword } from './actions'

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <form className="auth-form" action={resetPassword}>
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

          {searchParams?.message && (
            <div className={searchParams.message.includes('check your email') ? 'bg-green-50 text-green-700 p-3 rounded text-sm text-center border border-green-200' : 'auth-error'}>
              {searchParams.message}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            Send Reset Link
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
