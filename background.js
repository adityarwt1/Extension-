async function authenticateUser() {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url:
          "https://accounts.google.com/o/oauth2/auth?" +
          "client_id=371599318851-33ejqhm7jlp87t5t7km2v4vleudlv0ir.apps.googleusercontent.com" +
          "&response_type=token" +
          "&redirect_uri=" +
          encodeURIComponent(
            "https://ikjnplomhpafhpfaifkijikhjmnekjoi.chromiumapp.org/"
          ) +
          "&scope=" +
          encodeURIComponent(
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
          ),
        interactive: true,
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          reject(
            new Error(
              chrome.runtime.lastError?.message || "Failed to authenticate"
            )
          );
          return;
        }

        const params = new URLSearchParams(
          new URL(redirectUrl).hash.substring(1)
        );
        const token = params.get("access_token");

        if (!token) {
          reject(new Error("No access token received"));
          return;
        }

        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: "Bearer " + token },
          }
        ).then((res) => res.json());

        await chrome.storage.local.set({ token, userInfo });
        resolve(userInfo);
      }
    );
  });
}

// Listen for popup messages
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "authenticate") {
    authenticateUser()
      .then((user) => sendResponse({ success: true, user }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // async
  }
});
