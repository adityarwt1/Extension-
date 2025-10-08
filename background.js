// Handle OAuth authentication
async function authenticateUser() {
  try {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
    const clientId =
      "371599318851-33ejqhm7jlp87t5t7km2v4vleudlv0ir.apps.googleusercontent.com";

    // Use the extension's redirect URI
    const redirectUri = `index.html`;
    const state = Math.random().toString(36).substring(7);
    const scopes = "openid profile email";

    // Set OAuth parameters
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", state);

    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.href,
          interactive: true,
        },
        async (redirectUrl) => {
          if (chrome.runtime.lastError || !redirectUrl) {
            reject(
              new Error(
                `WebAuthFlow failed: ${chrome.runtime.lastError?.message}`
              )
            );
            return;
          }

          const params = new URLSearchParams(redirectUrl.split("?")[1]);
          const code = params.get("code");

          if (!code) {
            reject(new Error("No authorization code found"));
            return;
          }

          // Here you would exchange the code for access tokens
          // This requires a server endpoint to handle the token exchange
          resolve(code);
        }
      );
    });
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authenticate") {
    authenticateUser()
      .then((code) => {
        sendResponse({ success: true, code: code });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});
