import { cookies } from "next/headers";

// Main fetch function
// export async function googleApiFetch(accessToken: string, refreshToken: string, expiresAt: number, url: string, options: RequestInit = {}): Promise<Response> {
export async function googleApiFetchForCron(accessToken: string, refreshToken: string, url: string, options: RequestInit = {}): Promise<Response> {
    // const cookieStore = await cookies();
    // let accessToken = cookieStore.get("cm_googleapis_access_token")?.value;
    // const refreshToken = cookieStore.get("cm_googleapis_refresh_token")?.value;
    // const expiresAtStr = cookieStore.get("cm_googleapis_access_token_expires_at")?.value;

    // const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : 0;

    const expiresAt = 0;

    // Preemptively refresh token if it's about to expire in next 5 minutes
    const now = Date.now();
    const preemptiveWindow = 5 * 60 * 1000; // 5 minutes
    
    if ((!accessToken || now >= expiresAt - preemptiveWindow) && refreshToken) {
        console.log("Refreshing access token preemptively...");
        const tokenData = await refreshAccessToken(refreshToken);
        accessToken = tokenData.accessToken;
    }
    
    if (!accessToken) {
        throw new Error("Missing access token");
    }
    
    // Internal fetch helper
    const doFetch = async (token: string) => {
        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });
    };
    
    // Try request
    let response = await doFetch(accessToken);
    console.log("API response status:");
    console.log(response.status);
    
    // Fallback: refresh token on 401 if somehow expired
    if (response.status === 401 && refreshToken) {
        console.log("Access token expired, refreshing...");
        const tokenData = await refreshAccessTokenForCron(refreshToken);
        accessToken = tokenData.accessToken;
        response = await doFetch(accessToken);
    }
    
    return response;
}

// Refresh access token using refreshToken
async function refreshAccessTokenForCron(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        }),
    });
    
    if (!res.ok) {
        const err = await res.text();
        throw new Error("Failed to refresh token: " + err);
    }
    
    const data = await res.json();
    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in; // seconds
    
    // Calculate expiry timestamp (ms)
    const expiresAt = Date.now() + expiresIn * 1000;
    
    // Store updated token & expiry in cookies
    // const cookieStore = await cookies();
    // cookieStore.set("cm_googleapis_access_token", newAccessToken, {
    //     httpOnly: true,
    //     secure: true,
    //     path: "/",
    //     sameSite: "lax",
    //     maxAge: expiresIn,
    // });
    // cookieStore.set("cm_googleapis_access_token_expires_at", expiresAt.toString(), {
    //     httpOnly: true,
    //     secure: true,
    //     path: "/",
    //     sameSite: "lax",
    //     maxAge: expiresIn,
    // });
    
    return { accessToken: newAccessToken, expiresAt };
}

// Refresh access token using refreshToken
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        }),
    });
    
    if (!res.ok) {
        const err = await res.text();
        throw new Error("Failed to refresh token: " + err);
    }
    
    const data = await res.json();
    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in; // seconds
    
    // Calculate expiry timestamp (ms)
    const expiresAt = Date.now() + expiresIn * 1000;
    
    // Store updated token & expiry in cookies
    const cookieStore = await cookies();
    cookieStore.set("cm_googleapis_access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge: expiresIn,
    });
    cookieStore.set("cm_googleapis_access_token_expires_at", expiresAt.toString(), {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        maxAge: expiresIn,
    });
    
    return { accessToken: newAccessToken, expiresAt };
}

// Main fetch function
// export async function googleApiFetch(accessToken: string, refreshToken: string, expiresAt: number, url: string, options: RequestInit = {}): Promise<Response> {
export async function googleApiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("cm_googleapis_access_token")?.value;
    const refreshToken = cookieStore.get("cm_googleapis_refresh_token")?.value;
    const expiresAtStr = cookieStore.get("cm_googleapis_access_token_expires_at")?.value;

    const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : 0;

    // Preemptively refresh token if it's about to expire in next 5 minutes
    const now = Date.now();
    const preemptiveWindow = 5 * 60 * 1000; // 5 minutes
    
    if ((!accessToken || now >= expiresAt - preemptiveWindow) && refreshToken) {
        console.log("Refreshing access token preemptively...");
        const tokenData = await refreshAccessToken(refreshToken);
        accessToken = tokenData.accessToken;
    }
    
    if (!accessToken) {
        throw new Error("Missing access token");
    }
    
    // Internal fetch helper
    const doFetch = async (token: string) => {
        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });
    };
    
    // Try request
    let response = await doFetch(accessToken);
    console.log("API response status:");
    console.log(response.status);
    
    // Fallback: refresh token on 401 if somehow expired
    if (response.status === 401 && refreshToken) {
        console.log("Access token expired, refreshing...");
        const tokenData = await refreshAccessToken(refreshToken);
        accessToken = tokenData.accessToken;
        response = await doFetch(accessToken);
    }
    
    return response;
}