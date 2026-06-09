import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
    },
});

// Request interceptor — fetch CSRF cookie for Sanctum
api.interceptors.request.use(async (config) => {
    if (config.url && !config.url.startsWith("/login")) {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");
        await axios.get(`${base}/sanctum/csrf-cookie`, { withCredentials: true });
    }
    return config;
});

// Response interceptor — redirect on 401 in admin
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== "undefined") {
            const path = window.location.pathname;
            if (path.startsWith("/admin") && path !== "/admin/login") {
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(err);
    }
);

export default api;
