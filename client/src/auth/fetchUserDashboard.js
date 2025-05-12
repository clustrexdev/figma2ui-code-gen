async function FetchUser() {
    try {
        const accessToken = localStorage.getItem('figma_access_token');

        if (!accessToken) return; // No token = no need to fetch or modify UI    
        // window.localStorage.getItem("figma_access_token")
        console.log(window.localStorage.getItem("figma_accdess_token"))
        const endpoint = "https://api.figma.com/v1/me";
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(endpoint, {
            method: "GET",
            headers: headers
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("FetchUser error:", error);
        throw new Error(error?.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    FetchUser();
});
