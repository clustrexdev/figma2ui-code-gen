async function connectToFigma() {
    const button = document.getElementById("figmaConnectBtn");
   const buttonText = document.getElementById("figmaBtnText");
   // Disable button and show loader
   button.disabled = true;
   button.classList.add("opacity-50", "cursor-not-allowed");
   buttonText.innerText = "Connecting...";
   try {
   console.log("Connecting to Figma Account.");
   const endpoint = "https://zm04f9sb96.execute-api.ap-south-1.amazonaws.com/v1/login";
   const response = await fetch(endpoint, {
   method: "GET",
    });
   const data = await response.json();
   window.localStorage.setItem(
   'stored_state' , data['state']
    )
   window.location.href = data["auth_url"];
    } catch (error) {
   alert("Failed to connect: " + error.message);
   console.error(error);
    } finally {
   // Optional: re-enable if you’re not redirecting
   button.disabled = false;
   button.classList.remove("opacity-50", "cursor-not-allowed");
   buttonText.innerText = "Connect with Figma";
    }
}