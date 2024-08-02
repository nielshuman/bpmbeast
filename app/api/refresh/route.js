import { cookies } from "next/headers";
import { refreshAccessToken, decryptToken } from "../token";
export async function GET(req) {
    let encrypted_refresh_token = cookies().get('encrypted_refresh_token');
    if (!encrypted_refresh_token) return new Response('Error: No refresh token provided', {status: 400})
    let refreshToken = decryptToken(encrypted_refresh_token.value);
    let token = await refreshAccessToken(refreshToken);
    // res.cookie('access_token', token.access_token, { secure: true });
    cookies().set('access_token', token.access_token, { secure: true });
    // res.json({access_token: token.access_token});
    return Response.json({access_token: token.access_token});
}