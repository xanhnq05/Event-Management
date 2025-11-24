// Payment-related functions

// Create payment session
async function createPaymentSession(eventId, ticketQuantities) {
    try {
        const ticketIds = [];
        Object.entries(ticketQuantities).forEach(([ticketId, quantity]) => {
            for (let i = 0; i < quantity; i++) {
                ticketIds.push(ticketId);
            }
        });
        
        console.log('📤 Creating payment session:', { eventId, ticketIds });
        const response = await API.createPaymentSession(eventId, ticketIds);
        console.log('📥 Payment session response:', response);
        
        // Handle different response structures
        const session = response?.data || response;
        const sessionId = session?.session_id || session?.sessionId;
        
        if (!sessionId) {
            console.error('❌ No session_id in response:', response);
            throw new Error('Không thể tạo phiên thanh toán. Session ID không hợp lệ.');
        }
        
        console.log('✅ Payment session created with ID:', sessionId);
        return { ...session, session_id: sessionId };
    } catch (error) {
        console.error('❌ Error creating payment session:', error);
        showToast(error.message || 'Không thể tạo phiên thanh toán', 'error');
        throw error;
    }
}

// Process payment
async function processPayment(sessionId, otp, paymentMethod = 'wallet') {
    try {
        console.log('📤 Calling processPayment API with:', { sessionId, otp: '***', paymentMethod });
        const response = await API.processPayment(sessionId, otp, paymentMethod);
        console.log('📥 processPayment response:', response);
        
        // Handle different response structures
        const status = response?.data?.status || response?.status;
        
        if (status === 'success') {
            showToast('Thanh toán thành công!', 'success');
            return response.data || response;
        } else {
            showToast('Thanh toán thất bại', 'error');
            return null;
        }
    } catch (error) {
        console.error('❌ processPayment error:', error);
        showToast(error.message || 'Thanh toán thất bại', 'error');
        throw error;
    }
}

// Send OTP
async function sendOTP(email) {
    try {
        await API.sendOTP(email);
        showToast('Mã OTP đã được gửi đến email của bạn', 'success');
    } catch (error) {
        showToast(error.message || 'Không thể gửi OTP', 'error');
        throw error;
    }
}

// Load purchased tickets
async function loadPurchasedTickets() {
    try {
        console.log('📤 Đang tải vé đã mua...');
        const response = await API.getPurchasedTickets();
        console.log('📥 Response nhận được:', response);
        
        // Cấu trúc response: { success: true, data: [...] }
        let tickets = [];
        if (Array.isArray(response)) {
            tickets = response;
        } else if (response?.data && Array.isArray(response.data)) {
            tickets = response.data;
        } else if (response?.tickets && Array.isArray(response.tickets)) {
            tickets = response.tickets;
        } else {
            console.error('❌ Response không phải là array:', response);
            tickets = [];
        }
        
        console.log('📋 Số lượng vé:', tickets.length);
        return tickets;
    } catch (error) {
        console.error('❌ Error loading tickets:', error);
        return [];
    }
}

// Display tickets
function displayTickets(tickets) {
    const container = document.getElementById('tickets-container');
    if (!container) return;
    
    // Đảm bảo tickets là array
    if (!Array.isArray(tickets)) {
        console.error('❌ tickets không phải là array:', tickets);
        container.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--danger-color);">Lỗi: Dữ liệu vé không hợp lệ</p>';
        return;
    }
    
    if (tickets.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gray-400); margin: 0 auto 1rem;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                </svg>
                <p style="color: var(--gray-500); font-size: 1.125rem; margin-bottom: 1rem;">Bạn chưa có vé nào</p>
                <a href="/pages/events.html" class="btn btn-primary">Khám phá sự kiện</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tickets.map(ticket => createTicketCard(ticket)).join('');
}

// Create ticket card
function createTicketCard(ticket) {
    const checkInStatus = ticket.CheckIn_Status === 1 
        ? '<span style="color: var(--success-color);">✓ Đã check-in</span>'
        : '<span style="color: var(--gray-500);">Chưa check-in</span>';
    
    return `
        <div class="card" onclick="window.location.href='/pages/ticket-detail.html?id=${ticket.Purchased_ID}'" style="cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary-color);">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                    <span style="font-weight: 600;">#${ticket.Purchased_ID}</span>
                </div>
                ${checkInStatus}
            </div>
            
            ${ticket.Event ? `
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${ticket.Event.Event_Name}</h3>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>${formatDate(ticket.Event.Start_DateTime)}</span>
            </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
                <span style="font-size: 0.875rem; color: var(--gray-600);">${formatDate(ticket.Date_Purchase)}</span>
                <span style="color: var(--primary-color); font-size: 0.875rem;">Xem chi tiết →</span>
            </div>
        </div>
    `;
}

// Load ticket detail
async function loadTicketDetail(ticketId) {
    try {
        const response = await API.getTicketById(ticketId);
        // Handle response structure: { success: true, data: {...} }
        const ticket = response?.data || response;
        displayTicketDetail(ticket);
    } catch (error) {
        showToast('Không thể tải thông tin vé', 'error');
        console.error('Error loading ticket detail:', error);
    }
}

// Display ticket detail
function displayTicketDetail(ticket) {
    const container = document.getElementById('ticket-detail-container');
    if (!container) return;
    
    const qrValue = ticket.QR_Code || ticket.Purchased_ID;
    
    container.innerHTML = `
        <div class="card">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">Vé sự kiện</h1>
                <p style="color: var(--gray-600);">Mã vé: ${ticket.Purchased_ID}</p>
            </div>
            
            ${ticket.Event ? `
            <div style="border: 2px dashed var(--primary-color); border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${ticket.Event.Event_Name}</h2>
                    ${ticket.Event.Image_URL ? `
                    <img src="${getImageUrl(ticket.Event.Image_URL)}" alt="${ticket.Event.Event_Name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">
                    ` : ''}
                </div>
                
                <div class="grid grid-2" style="gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Thời gian</p>
                        <p style="font-weight: 600;">${formatDate(ticket.Event.Start_DateTime)}</p>
                    </div>
                    <div>
                        <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Địa điểm</p>
                        <p style="font-weight: 600;">${ticket.Event.Address || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Giá vé</p>
                        <p style="font-weight: 600;">${formatCurrency(ticket.Event.Price_Ticket)}</p>
                    </div>
                    <div>
                        <p style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Ngày mua</p>
                        <p style="font-weight: 600;">${formatDate(ticket.Date_Purchase)}</p>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
                    <div id="qrcode" style="background: white; padding: 1rem; border-radius: 0.5rem;"></div>
                </div>
                
                <div style="text-align: center;">
                    ${ticket.CheckIn_Status === 1 ? `
                    <div style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--success-color);">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span style="font-weight: 600;">Đã check-in</span>
                    </div>
                    ` : `
                    <p style="color: var(--gray-600);">Vui lòng xuất trình mã QR này tại sự kiện</p>
                    `}
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="downloadTicket()" class="btn btn-primary">
                    Tải vé (PDF)
                </button>
            </div>
            ` : ''}
        </div>
    `;
    
    // Generate QR Code - wait for DOM to be ready
    setTimeout(() => {
        generateQRCode('qrcode', qrValue);
    }, 100);
}

// Download ticket (placeholder)
function downloadTicket() {
    showToast('Tính năng tải vé đang được phát triển', 'success');
}

