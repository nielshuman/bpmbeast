
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { getAccessToken, encryptToken } from '../token';

export async function GET(req) {
    const params = req.nextUrl.searchParams;
    
    let code = params.get('code') || null;
    if (code === null) {
        return new Response('Error: No code provided' + a, {status: 400})
    }
  
    let token = await getAccessToken(code);
    // res.send(token);
    cookies().set('access_token', token.access_token, { secure: true });
    cookies().set('encrypted_refresh_token', encryptToken(token.refresh_token), { secure: true, httpOnly: true});
    redirect('/');
}