// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

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
    
    try {
        const response = await fetch(url, options);
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/pages/login.html';
            throw new Error('Unauthorized');
        }
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || 'An error occurred');
        }
        
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
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
        return apiCall('/events/categories');
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
        return apiCall('/users/topup', 'POST', { amount });
    },
    
    getTransactions: () => {
        return apiCall('/users/transactions');
    },
    
    // Payments
    createPaymentSession: (eventId, ticketIds) => {
        return apiCall('/payments/create', 'POST', {
            event_id: eventId,
            ticket_ids: ticketIds,
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
        return apiCall('/payments/tickets');
    },
    
    getTicketById: (ticketId) => {
        return apiCall(`/payments/tickets/${ticketId}`);
    },
};

