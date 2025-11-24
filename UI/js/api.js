// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Log khi script được load
console.log('✅ api.js đã được load');
console.log('✅ API_BASE_URL:', API_BASE_URL);
// Không log API object ở đây vì nó chưa được định nghĩa

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to get headers
function getHeaders(includeAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
}

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null, includeAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: getHeaders(includeAuth),
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    console.log(`🌐 API Call: ${method} ${url}`);
    console.log('Request options:', {
        method: options.method,
        headers: options.headers,
        body: options.body ? JSON.parse(options.body) : null
    });
    
    // Thêm timeout cho fetch request (30 giây)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    options.signal = controller.signal;
    
    try {
        console.log('⏳ Đang gửi request...');
        
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.log('❌ 401 Unauthorized - Xóa token và chuyển đến trang đăng nhập');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/pages/login.html';
            throw new Error('Unauthorized');
        }
        
        const responseData = await response.json();
        console.log('📦 Response data:', responseData);
        
        if (!response.ok) {
            console.error('❌ API Error - Status:', response.status);
            console.error('❌ API Error - Response:', responseData);
            const errorMessage = responseData.message || responseData.error || 'An error occurred';
            console.error('❌ Error message:', errorMessage);
            throw new Error(errorMessage);
        }
        
        // Kiểm tra thêm nếu response có success flag
        if (responseData.success === false) {
            console.error('❌ API returned success: false');
            console.error('❌ Response data:', responseData);
            throw new Error(responseData.message || 'Request failed');
        }
        
        console.log('✅ API Call thành công');
        return responseData;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ API Error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Xử lý các loại lỗi cụ thể
        if (error.name === 'AbortError') {
            console.error('❌ Request timeout - Không nhận được response sau 30 giây');
            throw new Error('Kết nối timeout. Vui lòng kiểm tra API Gateway và services có đang chạy không.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('❌ Network error - Không thể kết nối đến server');
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra API Gateway có đang chạy ở port 8000 không.');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('❌ Connection refused - Service không chạy');
            throw new Error('Service không phản hồi. Vui lòng kiểm tra auth-service có đang chạy ở port 3001 không.');
        }
        
        throw error;
    }
}

// API Functions
const API = {
    // Auth
    login: (account, password) => {
        return apiCall('/auth/login', 'POST', { account, password }, false);
    },
    
    register: (userData) => {
        return apiCall('/auth/register', 'POST', userData, false);
    },
    
    logout: () => {
        return apiCall('/auth/logout', 'POST');
    },
    
    getCurrentUser: () => {
        return apiCall('/auth/me');
    },
    
    changePassword: (oldPassword, newPassword) => {
        return apiCall('/auth/change-password', 'PUT', { oldPassword, newPassword });
    },
    
    sendOTP: (email, type = 'email') => {
        return apiCall('/otp/send', 'POST', { email, type });
    },
    
    verifyOTP: (email, code) => {
        return apiCall('/otp/verify', 'POST', { email, code });
    },
    
    // Events
    getEvents: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/events${queryString ? '?' + queryString : ''}`);
    },
    
    getEventById: (id) => {
        return apiCall(`/events/${id}`);
    },
    
    createEvent: (eventData) => {
        // For file upload, use FormData
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (eventData[key] !== null && eventData[key] !== undefined) {
                if (key === 'image' && eventData[key] instanceof File) {
                    formData.append('image', eventData[key]);
                } else {
                    formData.append(key, eventData[key]);
                }
            }
        });
        
        return fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then(res => res.json());
    },
    
    updateEvent: (id, eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (eventData[key] !== null && eventData[key] !== undefined) {
                if (key === 'image' && eventData[key] instanceof File) {
                    formData.append('image', eventData[key]);
                } else {
                    formData.append(key, eventData[key]);
                }
            }
        });
        
        return fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then(res => res.json());
    },
    
    deleteEvent: (id) => {
        return apiCall(`/events/${id}`, 'DELETE');
    },
    
    getCategories: () => {
        return apiCall('/categories');
    },
    
    getArtists: () => {
        return apiCall('/events/artists');
    },
    
    toggleFavorite: (eventId) => {
        return apiCall(`/events/${eventId}/favorite`, 'POST');
    },
    
    getFavoriteEvents: () => {
        return apiCall('/events/favorites');
    },
    
    getMyEvents: () => {
        // Get events created by current user
        // Assuming the backend filters by User_ID from token
        return apiCall('/events?my_events=true');
    },
    
    // Users
    getUser: (id) => {
        return apiCall(`/users/${id}`);
    },
    
    updateUser: (id, userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (userData[key] !== null && userData[key] !== undefined) {
                if (key === 'avatar' && userData[key] instanceof File) {
                    formData.append('avatar', userData[key]);
                } else {
                    formData.append(key, userData[key]);
                }
            }
        });
        
        return fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then(res => res.json());
    },
    
    getBalance: () => {
        return apiCall('/users/balance');
    },
    
    topUp: (amount) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.User_ID) {
            throw new Error('User not logged in');
        }
        return apiCall(`/users/${user.User_ID}/balance`, 'PUT', { amount, type: 'topup' });
    },
    
    getTransactions: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.User_ID) {
            throw new Error('User not logged in');
        }
        return apiCall(`/payments/user/${user.User_ID}/transactions`);
    },
    
    // Payments
    createPaymentSession: (eventId, ticketIds) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.User_ID) {
            throw new Error('User not logged in');
        }
        return apiCall('/payments/create', 'POST', {
            event_id: eventId,
            ticket_ids: ticketIds,
            user_id: user.User_ID,
        });
    },
    
    processPayment: (sessionId, otp, paymentMethod = 'wallet') => {
        return apiCall('/payments/process', 'POST', {
            session_id: sessionId,
            otp,
            payment_method: paymentMethod,
        });
    },
    
    getPaymentStatus: (paymentId) => {
        return apiCall(`/payments/${paymentId}/status`);
    },
    
    getPurchasedTickets: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.User_ID) {
            throw new Error('User not logged in');
        }
        return apiCall(`/payments/tickets/user/${user.User_ID}`);
    },
    
    getTicketById: (ticketId) => {
        return apiCall(`/payments/tickets/${ticketId}`);
    },
};

// Log sau khi API được định nghĩa
console.log('✅ API object đã được định nghĩa:', typeof API);
console.log('✅ API methods:', Object.keys(API));

