async function logout() {
    try {
        window.localStorage.removeItem("figma_access_token");
        window.localStorage.removeItem("figma_refresh_token");
        window.localStorage.removeItem("figma_token_expiry");
        window.localStorage.removeItem("figma_user_id");
        
        window.location.href = "/client/index.html";
    } catch (error) {
        throw new Error(error?.message);
    }
}