import { cookies } from "next/headers";
import { refreshAccessToken, decryptToken } from "../token";
export async function GET(req) {
    let refreshToken = decryptToken(cookies().get('encrypted_refresh_token'));
    let token = await refreshAccessToken(refreshToken);
    // res.cookie('access_token', token.access_token, { secure: true });
    cookies().set('access_token', token.access_token, { secure: true });
    // res.json({access_token: token.access_token});
    return Response.json({access_token: token.access_token});
}