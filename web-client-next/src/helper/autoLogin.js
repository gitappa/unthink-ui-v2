import { apiInstance } from './apiCall';
import { auraYfretUserCollBaseUrl } from '../constants/config';
import Fernet from "fernet";

// signin_with_link endpoint (serverAPIs defines this constant internally)
const signInWithLinkRequestUrl = '/users/signin_with_link';

// Call /users/signin_with_link?emailId=<email>&is_auto_login=true
export const requestSigninWithLink = async (email) => {
  try {
    const url = `https://aurastage.unthink.ai/users/signin_with_link`;

    const res = await apiInstance({
      url,
      method: 'get',
      params: {
        emailId: email,
        is_auto_login: true,
      },
    });

    return res?.data || null;
  } catch (e) {
    console.error('requestSigninWithLink error', e);
    return null;
  }
};

// Decrypt token using FERNET secret key
// NOTE: client-side Fernet decryption caused dependency issues in the browser build.
// The server currently returns a signin_token that the verify endpoint accepts.
// So we return the signin_token as-is. If client-side decryption is required,
// we can re-introduce 'fernet' and decode using NEXT_PUBLIC_FERNET_SECRET_KEY.
export const decryptSigninToken = (signin_token) => {
  if (!signin_token) {
    console.warn("decryptSigninToken: No signin_token provided");
    return null;
  }

  try {
    const secretKey = process.env.NEXT_PUBLIC_FERNET_SECRET_KEY;
    if (!secretKey) {
      console.warn("decryptSigninToken: NEXT_PUBLIC_FERNET_SECRET_KEY not configured");
      // Passthrough the token if we can't decrypt
      return signin_token;
    }

    const secret = new Fernet.Secret(secretKey);
    const token = new Fernet.Token({
      secret,
      token: signin_token,
      ttl: 0,
    });
    const decryptedToken = token.decode();
    
    console.log("decryptSigninToken",decryptedToken);
    return decryptedToken || null;
  } catch (error) {
    console.error("decryptSigninToken error:", error?.message || error);
    // Passthrough the signin_token on error (server can handle it)
    console.warn("decryptSigninToken: Returning token as-is (server will handle decryption)");
    return signin_token;
  }
};

// Generate verify URL for a given decrypted token and page path
export const buildVerifyUrl = (decryptedToken, pagePath = '') => {
  if (!decryptedToken) return '';
  // Use query param for token to avoid issues with tokens containing
  // characters that can break dynamic path segments (slashes, dots, etc.).
  const base = `/user/verify/${decryptedToken}`;
    return pagePath ? `${base}${pagePath}` : base;
};

export default { requestSigninWithLink, decryptSigninToken, buildVerifyUrl };
