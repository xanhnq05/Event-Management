// Authentication functions

// Login
async function handleLogin(event) {
    event.preventDefault();
    
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    
    if (!account || !password) {
        errorDiv.textContent = 'Vui lòng điền đầy đủ thông tin';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await API.login(account, password);
        
        if (response.token && response.user) {
            setCurrentUser(response.user, response.token);
            showToast('Đăng nhập thành công!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        }
    } catch (error) {
        errorDiv.textContent = error.message || 'Đăng nhập thất bại';
        errorDiv.style.display = 'block';
    }
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
        
        if (userName) userName.textContent = user.FullName || 'User';
        if (userBalance) userBalance.textContent = formatCurrency(user.Amount || 0);
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

