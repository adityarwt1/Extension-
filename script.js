// Initialize Google Sign In when library loads
window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "371599318851-33ejqhm7jlp87t5t7km2v4vleudlv0ir.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  // Display the One Tap prompt
  google.accounts.id.prompt();
};

// Handle the credential response from Google
function handleCredentialResponse(response) {
  // Decode the JWT token
  const responsePayload = decodeJwtResponse(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Given Name: " + responsePayload.given_name);
  console.log("Family Name: " + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  // Update UI with user info
  displayUserInfo(responsePayload);
}

// Decode JWT token to get user information
function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Display user information in the UI
function displayUserInfo(userInfo) {
  document.getElementById("g_id_onload").style.display = "none";
  document.querySelector(".g_id_signin").style.display = "none";
  document.getElementById("user-info").style.display = "block";

  document.getElementById("user-name").textContent = userInfo.name;
  document.getElementById("user-email").textContent = userInfo.email;
  document.getElementById("user-picture").src = userInfo.picture;
}

// Sign out function
function signOut() {
  google.accounts.id.disableAutoSelect();
  document.getElementById("user-info").style.display = "none";
  document.getElementById("g_id_onload").style.display = "block";
  document.querySelector(".g_id_signin").style.display = "block";
  console.log("User signed out");
}

// Alternative: Render button programmatically
function renderSignInButton() {
  google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
    theme: "outline",
    size: "large",
    type: "standard",
    text: "signin_with",
    shape: "pill",
    logo_alignment: "left",
  });
}
