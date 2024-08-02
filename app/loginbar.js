
export function LoginBar({logged_in}) {  
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
  