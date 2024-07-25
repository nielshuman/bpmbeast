import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import querystring from 'querystring';
import axios from 'axios';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const api = express.Router();

app.use(cookieParser());
app.use('/api', api);
app.use('/dist', express.static('dist'));
app.use(express.static('www'));

api.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      scope: 'user-read-private user-read-email user-library-read streaming user-modify-playback-state',
      redirect_uri: process.env.API_BASE_URL + '/callback',
      client_id: process.env.CLIENT_ID,
      state: crypto.randomBytes(16).toString('base64url')
    }));
});

api.get('/logout', (req, res) => { 
  res.clearCookie('access_token');
  res.clearCookie('encrypted_refresh_token');
  res.redirect('/index.html');
});

// GEVAARLIJKE TEST ENDPOINTS
// api.get('/encrypt', (req, res) => {
//   res.send(encryptToken(req.query.token));
// });

// api.get('/decrypt', (req, res) => {
//   res.send(decryptToken(req.query.token));
// });

api.get('/callback', async (req, res) => {
  let code = req.query.code || null;
  if (code === null) {
    res.send('Error: No code received', 400);
    return;
  }

  let token = await getAccessToken(code);
  // res.send(token);

  res.cookie('access_token', token.access_token, { secure: true });
  res.cookie('encrypted_refresh_token', encryptToken(token.refresh_token), { secure: true, httpOnly: true});
  res.redirect('/index.html');

});

api.get('/refresh', async (req, res) => { 
  let refreshToken = decryptToken(req.cookies.encrypted_refresh_token);
  let token = await refreshAccessToken(refreshToken);
  res.cookie('access_token', token.access_token, { secure: true });
  res.json({access_token: token.access_token});
});

async function getAccessToken(code) {
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



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

