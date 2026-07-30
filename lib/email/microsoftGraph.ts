import { ConfidentialClientApplication } from '@azure/msal-node';

let cca: ConfidentialClientApplication | null = null;

/**
 * Initializes and returns the MSAL Confidential Client Application instance.
 */
function getMsalClient(): ConfidentialClientApplication {
  if (cca) return cca;

  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing Microsoft Graph configuration. Please check MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, and MICROSOFT_CLIENT_SECRET.');
  }

  cca = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
  });

  return cca;
}

export const _testOverrides = {
  getAccessToken: null as (() => Promise<string>) | null,
};

/**
 * Acquires an access token for Microsoft Graph using the Client Credentials Flow.
 */
export async function getAccessToken(): Promise<string> {
  if (_testOverrides.getAccessToken) {
    return _testOverrides.getAccessToken();
  }

  const client = getMsalClient();
  const tokenResponse = await client.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });

  if (!tokenResponse || !tokenResponse.accessToken) {
    throw new Error('Failed to acquire access token from Microsoft Entra ID.');
  }

  return tokenResponse.accessToken;
}

/**
 * Sends an email using Microsoft Graph's sendMail API by posting a base64-encoded MIME string.
 * This ensures multi-part message integrity (HTML + plain text fallback).
 * 
 * @param mimeBase64 The base64 encoded raw RFC 822 MIME email content.
 */
export async function sendMimeEmail(mimeBase64: string): Promise<void> {
  const senderEmail = process.env.MICROSOFT_SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error('Missing MICROSOFT_SENDER_EMAIL environment variable.');
  }

  const accessToken = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'text/plain',
    },
    body: mimeBase64,
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch {
      errorText = response.statusText;
    }
    throw new Error(`Microsoft Graph API error (${response.status}): ${errorText}`);
  }
}
