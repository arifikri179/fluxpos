import axios from 'axios';

const api = axios.create({

  baseURL: 'http://127.0.0.1:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // PERBAIKAN: Cek apakah token ada DAN bukan string "null"/"undefined"
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Hapus header Authorization jika tidak ada token valid
      // Penting agar request Register/Login tetap bersih/Public
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opsional: Interceptor untuk handle error 401 secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token kadaluarsa, otomatis logout
    if (error.response && error.response.status === 401) {
      // localStorage.clear(); // Aktifkan jika ingin auto-logout saat token mati
    }
    return Promise.reject(error);
  }
);

export default api;