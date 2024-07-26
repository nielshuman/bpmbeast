import { cookies } from "next/headers"

export function LoginBar() {
    let logged_in = Boolean(cookies().get('access_token'))
  
    return <div>
      <div>
        {logged_in ? 'Logged in' : 'Not logged in'}
      </div>
      <div>
        {logged_in ? <a href="/api/logout"> Logout </a> : <a href="/api/login">Login </a>}
      </div>
      <br></br>
    </div>
  }
  