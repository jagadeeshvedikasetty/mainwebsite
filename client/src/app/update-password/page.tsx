import Link from 'next/link'
import '../login/login.css'
import { updatePassword } from './actions'

export default async function UpdatePasswordPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        <div className="auth-header">
          <h2>Update Password</h2>
          <p>Please enter your new password below.</p>
        </div>
        
        <form className="auth-form" action={updatePassword}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {searchParams?.message && (
            <div className="auth-error">
              {searchParams.message}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            Update Password
          </button>
        </form>

      </div>
    </div>
  )
}
