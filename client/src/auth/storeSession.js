async function handleSessionStorage() {
    try {
        console.log("Starting OAuth token exchange process");
        // Get stored state from localStorage
        const stored_state = window.localStorage.getItem('stored_state');
        console.log("Retrieved stored state:", stored_state);
        
        // Get code and state from URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        console.log("URL parameters:", { code: code ? `${code.substring(0, 5)}...` : null, state });
        
        // Update status
        updateStatus("Verifying authentication parameters...");
        
        // Validate parameters
        if (!code) {
            throw new Error("Missing authorization code from Figma");
        }
        if (!state) {
            throw new Error("Missing state parameter from Figma");
        }
        if (!stored_state) {
            throw new Error("No stored state found in localStorage");
        }
        
        // Verify state parameter to prevent CSRF attacks
        if (state !== stored_state) {
            throw new Error("State parameter mismatch - security risk detected");
        }
        console.log("State verification successful");
        updateStatus("State verification successful, exchanging tokens...");
        
        // This would typically be your backend endpoint that securely handles the token exchange
        // Since you want to do it client-side, we'll create a direct implementation
        // NOTE: This is not recommended for production as it exposes your client secret
        // Replace these with your actual Figma app credentials
        const clientId = ""; // Replace with your actual client ID
        const clientSecret = "" // Replace with your actual client secret
        const redirectUri = "http://127.0.0.1:5500/client/pages/auth/splash.html"; // Must match exactly what was used in the initial auth request
        
        // Create Basic Auth header
        const authString = `${clientId}:${clientSecret}`;
        const base64Auth = btoa(authString);
        
        // Prepare request to Figma API
        const endpoint = "https://api.figma.com/v1/oauth/token";
        
        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('redirect_uri', redirectUri);
        formData.append('code', code);
        formData.append('grant_type', 'authorization_code');
        
        console.log("Sending token exchange request to Figma API");
        updateStatus("Connecting to Figma API...");
        
        // Make the request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });
        
        // Parse the response
        const responseData = await response.json();

        console.log(responseData);

        // Check for errors
        if (!response.ok) {
            console.error("Error response from Figma API:", responseData);
            throw new Error(`Figma API error: ${responseData.message || "Unknown error"}`);
        }
        
        console.log("Figma OAuth successful! Token response received");
        updateStatus("Authentication successful!");
        
        // Store tokens securely
        localStorage.setItem('figma_access_token', responseData?.access_token);
        localStorage.setItem('figma_refresh_token', responseData?.refresh_token);
        localStorage.setItem('figma_token_expiry', Date.now() + (responseData?.expires_in * 1000));
        localStorage.setItem('figma_user_id', responseData.user_id_string);
        
        // Clear the stored state as it's no longer needed
        localStorage.removeItem('stored_state');
        
        // Return the token data
        return responseData;
    } catch (error) {
        console.error("Figma OAuth error:", error);
        showError(error?.message || "Unknown error during OAuth process");
        throw error;
    }
}

function updateStatus(message) {
    const statusEl = document.getElementById("authStatus");
    if (statusEl) {
        statusEl.textContent = message;
    }
}

function showError(message) {
    // Hide loading spinner
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "none";
    
    // Show error container and message
    const errorContainer = document.getElementById("errorContainer");
    const errorMessage = document.getElementById("errorMessage");
    
    if (errorContainer && errorMessage) {
        errorContainer.classList.remove("hidden");
        errorMessage.textContent = message;
        updateStatus("Authentication failed");
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if this is an OAuth callback (has code and state parameters)
        const params = new URLSearchParams(window.location.search);
        if (params.has("code") && params.has("state")) {
            console.log("OAuth callback detected. Processing...");
            
            // Handle the callback
            await handleSessionStorage();
            
            // Hide loading spinner
            document.getElementById("loadingSpinner").style.display = "none";
            
            // Update UI to show success
            updateStatus("Successfully connected to Figma!");
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = "/client/pages/dashboard/overview.html";
            }, 1500);
        } else {
            // Not a callback, just show normal status
            updateStatus("Waiting for Figma authentication...");
        }
    } catch (error) {
        console.error("Error handling OAuth callback:", error);
        showError(error.message || "Authentication process failed");
    }
});