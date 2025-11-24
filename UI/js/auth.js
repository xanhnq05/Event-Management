// Authentication functions

// Kiểm tra khi script được load
console.log('✅ auth.js đã được load');
console.log('✅ handleLogin function:', typeof handleLogin);

// Login
async function handleLogin(event) {
    console.log('🔵 handleLogin được gọi!');
    console.log('Event:', event);
    
    if (event) {
        event.preventDefault();
    }
    
    console.log('=== BẮT ĐẦU ĐĂNG NHẬP ===');
    
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    
    console.log('Thông tin đăng nhập:', { account, passwordLength: password.length });
    
    if (!account || !password) {
        console.log('❌ Thiếu thông tin đăng nhập');
        errorDiv.textContent = 'Vui lòng điền đầy đủ thông tin';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        console.log('📤 Đang gửi request đăng nhập...');
        const response = await API.login(account, password);
        
        console.log('📥 Response nhận được:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        // Kiểm tra response có hợp lệ không
        if (!response) {
            console.error('❌ Response rỗng hoặc undefined');
            errorDiv.textContent = 'Đăng nhập thất bại: Không nhận được phản hồi từ server';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Kiểm tra success flag nếu có
        if (response.success === false) {
            console.error('❌ Response có success: false');
            console.error('Response:', response);
            errorDiv.textContent = response.message || 'Đăng nhập thất bại';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Cấu trúc response từ auth service: { success: true, data: { user, accessToken, refreshToken } }
        // Kiểm tra nhiều cấu trúc response có thể có
        const token = response?.data?.accessToken || response?.data?.token || response?.token || response?.accessToken;
        const user = response?.data?.user || response?.user || response?.data;
        
        console.log('Token:', token ? 'Có token (' + token.substring(0, 20) + '...)' : '❌ Không có token');
        console.log('User:', user ? 'Có user data' : '❌ Không có user data');
        
        // CHỈ redirect khi CÓ CẢ token VÀ user
        if (token && user) {
            console.log('✅ CÓ ĐỦ token và user - Đăng nhập thành công!');
            console.log('✅ Đăng nhập thành công!');
            console.log('User data:', user);
            console.log('Token:', token.substring(0, 20) + '...');
            
            setCurrentUser(user, token);
            console.log('✅ Đã lưu user và token vào localStorage');
            
            showToast('Đăng nhập thành công!', 'success');
            
            // Redirect to home page
            console.log('🔄 Đang chuyển hướng đến trang chủ...');
            console.log('Current pathname:', window.location.pathname);
            console.log('Current href:', window.location.href);
            console.log('Current origin:', window.location.origin);
            
            // Xác định đường dẫn chính xác - luôn dùng đường dẫn tuyệt đối để đảm bảo
            const homePath = '/index.html';
            const fullUrl = window.location.origin + homePath;
            
            console.log('📍 Đường dẫn sẽ chuyển đến:', homePath);
            console.log('📍 URL đầy đủ sẽ là:', fullUrl);
            
            // Redirect function - dùng nhiều cách để đảm bảo hoạt động
            const doRedirect = () => {
                console.log('⏰ Bắt đầu redirect...');
                console.log('📍 Redirecting to:', homePath);
                console.log('📍 Full URL:', fullUrl);
                
                // Lưu lại pathname hiện tại để kiểm tra
                const beforeRedirect = window.location.pathname;
                console.log('📍 Pathname trước redirect:', beforeRedirect);
                
                try {
                    // Cách 1: window.location.href (thường hoạt động tốt nhất)
                    console.log('🔄 Cách 1: Thử window.location.href...');
                    window.location.href = homePath;
                    console.log('✅ Đã set window.location.href =', homePath);
                    
                    // Kiểm tra ngay sau đó
                    requestAnimationFrame(() => {
                        console.log('📍 Pathname sau requestAnimationFrame:', window.location.pathname);
                        if (window.location.pathname === beforeRedirect) {
                            console.log('⚠️ Chưa redirect, thử cách 2...');
                            // Cách 2: window.location.replace
                            window.location.replace(homePath);
                        }
                    });
                    
                    // Kiểm tra lại sau 200ms
                    setTimeout(() => {
                        const currentPath = window.location.pathname;
                        console.log('📍 Pathname sau 200ms:', currentPath);
                        if (currentPath.includes('login') || currentPath === beforeRedirect) {
                            console.log('⚠️ Vẫn chưa redirect, thử window.location.replace...');
                            window.location.replace(homePath);
                        } else {
                            console.log('✅ Redirect thành công! Đã chuyển đến:', currentPath);
                        }
                    }, 200);
                    
                } catch (error) {
                    console.error('❌ Lỗi khi redirect:', error);
                    console.error('Error stack:', error.stack);
                    // Fallback: thử các cách khác
                    try {
                        console.log('🔄 Fallback: Thử window.location.replace...');
                        window.location.replace(homePath);
                    } catch (e2) {
                        console.log('🔄 Fallback: Thử window.location...');
                        window.location = homePath;
                    }
                }
            };
            
            // Redirect sau 500ms để toast hiển thị
            console.log('⏳ Sẽ redirect sau 500ms...');
            setTimeout(doRedirect, 500);
            
            // Backup: redirect lại sau 2 giây nếu vẫn chưa chuyển
            setTimeout(() => {
                const currentPath = window.location.pathname;
                console.log('🔍 Kiểm tra backup - Pathname hiện tại:', currentPath);
                if (currentPath.includes('login') || currentPath.includes('/pages/login')) {
                    console.log('⚠️ Vẫn ở trang login sau 2 giây, FORCE redirect...');
                    console.log('🔄 Force redirect to:', homePath);
                    window.location.href = homePath;
                    // Nếu vẫn không được, thử replace
                    setTimeout(() => {
                        if (window.location.pathname.includes('login')) {
                            window.location.replace(homePath);
                        }
                    }, 100);
                } else {
                    console.log('✅ Đã redirect thành công đến:', currentPath);
                }
            }, 2000);
        } else {
            // KHÔNG có token hoặc user - KHÔNG redirect
            console.error('❌ Response không có token hoặc user - KHÔNG redirect');
            console.error('Token có:', !!token);
            console.error('User có:', !!user);
            console.error('Response đầy đủ:', JSON.stringify(response, null, 2));
            console.error('Response.data:', response?.data);
            errorDiv.textContent = 'Đăng nhập thất bại: Tên đăng nhập hoặc mật khẩu không đúng';
            errorDiv.style.display = 'block';
            // KHÔNG redirect ở đây
            return;
        }
    } catch (error) {
        // Lỗi từ API - KHÔNG redirect
        console.error('❌ Lỗi đăng nhập:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Hiển thị thông báo lỗi phù hợp
        let errorMessage = 'Đăng nhập thất bại';
        if (error.message.includes('Invalid credentials') || error.message.includes('Unauthorized')) {
            errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
        // KHÔNG redirect ở đây - chỉ hiển thị lỗi
    }
    
    console.log('=== KẾT THÚC ĐĂNG NHẬP ===');
}

// Register
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        FullName: document.getElementById('fullName').value,
        Account: document.getElementById('account').value,
        Gmail: document.getElementById('email').value,
        Phone: document.getElementById('phone').value,
        Address: document.getElementById('address').value,
        Birthday: document.getElementById('birthday').value,
        Sex: document.getElementById('sex').value,
        Password: document.getElementById('password').value,
    };
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error-message');
    
    // Validation
    if (!validateEmail(formData.Gmail)) {
        errorDiv.textContent = 'Email không hợp lệ';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (formData.Password !== confirmPassword) {
        errorDiv.textContent = 'Mật khẩu xác nhận không khớp';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!validatePassword(formData.Password)) {
        errorDiv.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        await API.register(formData);
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
    } catch (error) {
        errorDiv.textContent = error.message || 'Đăng ký thất bại';
        errorDiv.style.display = 'block';
    }
}

// Logout
async function handleLogout() {
    try {
        await API.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearUser();
        window.location.href = '/index.html';
    }
}

// Change password
async function handleChangePassword(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    if (!validatePassword(newPassword)) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }
    
    try {
        await API.changePassword(oldPassword, newPassword);
        showToast('Đổi mật khẩu thành công!', 'success');
        event.target.reset();
    } catch (error) {
        showToast(error.message || 'Đổi mật khẩu thất bại', 'error');
    }
}

// Initialize auth on page load
function initAuth() {
    // Check if user is logged in and update UI
    const user = getCurrentUser();
    const userMenu = document.getElementById('user-menu');
    const loginLink = document.getElementById('login-link');
    
    if (user && userMenu) {
        userMenu.style.display = 'flex';
        if (loginLink) loginLink.style.display = 'none';
        
        // Update user info in menu
        const userName = userMenu.querySelector('.user-name');
        const userBalance = userMenu.querySelector('.user-balance');
        const userAvatar = userMenu.querySelector('#user-avatar');
        
        if (userName) userName.textContent = user.FullName || 'User';
        if (userBalance) userBalance.textContent = formatCurrency(user.Amount || 0);
        
        // Display user avatar if available
        if (userAvatar && user.Avatar_URL) {
            userAvatar.src = user.Avatar_URL;
            userAvatar.style.display = 'block';
        } else if (userAvatar) {
            userAvatar.style.display = 'none';
        }
    } else if (loginLink) {
        loginLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

