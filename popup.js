document.addEventListener("DOMContentLoaded", async () => {
  const signInBtn = document.getElementById("sign-in-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const authSection = document.getElementById("auth-section");
  const userSection = document.getElementById("user-section");

  // Load saved user info
  const { userInfo } = await chrome.storage.local.get("userInfo");
  if (userInfo) {
    showUser(userInfo);
  }

  signInBtn.addEventListener("click", async () => {
    signInBtn.textContent = "Signing in...";
    signInBtn.disabled = true;
    try {
      const res = await chrome.runtime.sendMessage({ action: "authenticate" });
      if (res.success) {
        showUser(res.user);
      } else {
        alert("Auth failed: " + res.error);
      }
    } finally {
      signInBtn.textContent = "Sign in with Google";
      signInBtn.disabled = false;
    }
  });

  signOutBtn.addEventListener("click", async () => {
    await chrome.storage.local.clear();
    userSection.style.display = "none";
    authSection.style.display = "block";
  });

  function showUser(user) {
    document.getElementById("user-pic").src = user.picture;
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-email").textContent = user.email;

    authSection.style.display = "none";
    userSection.style.display = "block";
  }
});
