document.addEventListener("DOMContentLoaded", function () {
  const signInBtn = document.getElementById("sign-in-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const authSection = document.getElementById("auth-section");
  const userSection = document.getElementById("user-section");

  // Check if user is already authenticated
  checkAuthStatus();

  signInBtn.addEventListener("click", async () => {
    try {
      signInBtn.textContent = "Signing in...";
      signInBtn.disabled = true;

      const response = await chrome.runtime.sendMessage({
        action: "authenticate",
      });

      if (response.success) {
        // Store authentication data
        await chrome.storage.local.set({
          authCode: response.code,
          isAuthenticated: true,
        });

        showUserSection();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Authentication failed: " + error.message);
    } finally {
      signInBtn.textContent = "Sign in with Google";
      signInBtn.disabled = false;
    }
  });

  signOutBtn.addEventListener("click", async () => {
    await chrome.storage.local.clear();
    showAuthSection();
  });

  async function checkAuthStatus() {
    const result = await chrome.storage.local.get(["isAuthenticated"]);
    if (result.isAuthenticated) {
      showUserSection();
    }
  }

  function showAuthSection() {
    authSection.style.display = "block";
    userSection.style.display = "none";
  }

  function showUserSection() {
    authSection.style.display = "none";
    userSection.style.display = "block";
    document.getElementById("user-info").innerHTML =
      "<p>Authentication successful!</p>";
  }
});
