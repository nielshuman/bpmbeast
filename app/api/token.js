import querystring from 'querystring';
import axios from 'axios';
import crypto from 'crypto';

export async function getAccessToken(code) {
  const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
    code: code,
    redirect_uri: process.env.API_BASE_URL + '/callback',
    grant_type: 'authorization_code',
  }), {
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

export async function refreshAccessToken(refreshToken) {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
}
  /**
 * Encrypt met AES-256-CBC
 */
export function encryptToken(token) {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(process.env.SYMMETRIC_ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }
  
  /**
   * Decrypt met AES-256-CBC
   */
export function decryptToken(encryptedtoken) {
    const iv = Buffer.from(encryptedtoken.slice(0, 32), 'hex');
    const key = Buffer.from(process.env.SYMMETRIC_ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedtoken.slice(32), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

