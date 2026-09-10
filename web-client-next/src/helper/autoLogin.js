import { apiInstance } from './apiCall';
import { auraYfretUserCollBaseUrl, secretToken } from '../constants/config';
import { collectionQRCodeGenerator } from './utils';
import Fernet from "fernet";

// signin_with_link endpoint (serverAPIs defines this constant internally)
const signInWithLinkRequestUrl = '/users/signin_with_link';

// Call /users/signin_with_link?emailId=<email>&is_auto_login=true
export const requestSigninWithLink = async ({email,phone}) => {
  try {
    // console.log('email',email);
    // console.log('phone',phone);
    
    
    const emailId =
      typeof email === 'string' ? email : email?.email || email?.emailId;

    // if (!emailId || !phone) {
    //   console.warn('requestSigninWithLink: missing emailId or phone');
    //   return null;
    // }

    const url = `${auraYfretUserCollBaseUrl}/users/signin_with_link`;
// console.log('hello world');

    const res = await apiInstance({
      url,
      method: 'get',
      params: {
        phone:phone ,
        emailId:emailId || '',
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
// we can re-introduce 'fernet' and decode using secretToken.
export const decryptSigninToken = (signin_token) => {
  if (!signin_token) {
    console.warn("decryptSigninToken: No signin_token provided");
    return null;
  }

  try {
    const secretKey = secretToken;
    if (!secretKey) {
      console.warn("decryptSigninToken: secretToken not configured");
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

export const buildKioskAutoLoginUrls = async ({
  targetPath,
  pageParam,
  fallbackQrUrl,
  errorLabel,
  kioskLogin = {},
  userId = null,
  email = null,
  phone = null,
  requireUserId = false,
} = {}) => {
  if (typeof window === "undefined" || !targetPath) return null;

  const originPrefix = `${window.location?.origin || ""}`;
  const normalUrl = targetPath.startsWith("http")
    ? targetPath
    : `${originPrefix}${targetPath}`;

  try {
    const kioskLoginUserId = userId || kioskLogin?.user_id;
    const kioskLoginEmail = email || kioskLogin?.email;
    const kioskLoginPhone = phone || kioskLogin?.phone;
    const canBuildAutoLogin =
      (!requireUserId || kioskLoginUserId) &&
      (kioskLoginEmail || kioskLoginPhone) &&
      pageParam;

    if (canBuildAutoLogin) {
      const resp = await requestSigninWithLink({
        email: kioskLoginEmail,
        phone: kioskLoginPhone,
      });
      const signin_token = resp?.data?.signin_token;
      
      if (signin_token) {
        const decrypted = decryptSigninToken(signin_token);
        if (decrypted) {
          const verifyLink = buildVerifyUrl(decrypted, pageParam);
          const fullVerifyUrl = verifyLink?.startsWith("http")
            ? verifyLink
            : `${originPrefix}${verifyLink}`;

          return {
            shareUrl: fullVerifyUrl,
            qrUrl: collectionQRCodeGenerator(fullVerifyUrl),
            isAutoLogin: true,
          };
        }
      }
    }
  } catch (e) {
    console.error(`${errorLabel || "auto-login"} build error`, e);
  }

  return {
    shareUrl: normalUrl,
    qrUrl: fallbackQrUrl || collectionQRCodeGenerator(normalUrl),
    isAutoLogin: false,
  };
};

export default {
  requestSigninWithLink,
  decryptSigninToken,
  buildVerifyUrl,
  buildKioskAutoLoginUrls,
};
