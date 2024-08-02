import { redirect } from "next/navigation";
import querystring from 'querystring';
import crypto from 'crypto';

export async function GET() {
    redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      scope: 'user-read-private user-read-email user-library-read streaming user-modify-playback-state',
      redirect_uri: process.env.API_BASE_URL + '/callback',
      client_id: process.env.CLIENT_ID,
      state: crypto.randomBytes(16).toString('base64url')
    }));
}