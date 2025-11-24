// Event-related functions

// Load featured events
async function loadFeaturedEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    showLoading(container);
    
    try {
        console.log('📤 Đang tải sự kiện nổi bật...');
        const response = await API.getEvents({ limit: 6 });
        console.log('📥 Response nhận được:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        // Cấu trúc response: { success: true, data: [...] }
        let events = [];
        if (Array.isArray(response)) {
            // Nếu response là array trực tiếp
            events = response;
        } else if (response?.data && Array.isArray(response.data)) {
            // Nếu response có data là array
            events = response.data;
        } else if (response?.events && Array.isArray(response.events)) {
            // Nếu response có events là array
            events = response.events;
        } else {
            console.error('❌ Response không phải là array hoặc không có data/events:', response);
            events = [];
        }
        
        // Load favorite status for each event
        const user = getCurrentUser();
        if (user) {
            try {
                const favoritesResponse = await API.getFavoriteEvents();
                const favoriteEvents = Array.isArray(favoritesResponse) 
                    ? favoritesResponse 
                    : (favoritesResponse?.events || favoritesResponse?.data || []);
                const favoriteIds = new Set(favoriteEvents.map(e => e.Event_ID || e.event_id));
                
                events = events.map(event => ({
                    ...event,
                    isFavorite: favoriteIds.has(event.Event_ID)
                }));
            } catch (error) {
                console.warn('Could not load favorites:', error);
            }
        }
        
        console.log('📋 Số lượng sự kiện:', events.length);
        console.log('Events:', events);
        
        if (!Array.isArray(events)) {
            console.error('❌ events không phải là array:', events);
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--danger-color);">Lỗi: Dữ liệu sự kiện không hợp lệ</p>';
            return;
        }
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--gray-500);">Không tìm thấy sự kiện nào</p>';
            return;
        }
        
        container.innerHTML = events.map(event => createEventCard(event)).join('');
        console.log('✅ Đã hiển thị sự kiện thành công');
    } catch (error) {
        console.error('❌ Lỗi khi tải sự kiện:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        container.innerHTML = `<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--danger-color);">Lỗi khi tải sự kiện: ${error.message}</p>`;
    }
}

// Load all events with filters
async function loadEvents(searchTerm = '', category = '') {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    showLoading(container);
    
    try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (category) params.category = category;
        
        console.log('📤 Đang tải sự kiện với params:', params);
        const response = await API.getEvents(params);
        console.log('📥 Response nhận được:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        // Cấu trúc response: { success: true, data: [...] }
        let events = [];
        if (Array.isArray(response)) {
            // Nếu response là array trực tiếp
            events = response;
        } else if (response?.data && Array.isArray(response.data)) {
            // Nếu response có data là array
            events = response.data;
        } else if (response?.events && Array.isArray(response.events)) {
            // Nếu response có events là array
            events = response.events;
        } else {
            console.error('❌ Response không phải là array hoặc không có data/events:', response);
            events = [];
        }
        
        console.log('📋 Số lượng sự kiện:', events.length);
        console.log('Events:', events);
        
        if (!Array.isArray(events)) {
            console.error('❌ events không phải là array:', events);
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--danger-color);">Lỗi: Dữ liệu sự kiện không hợp lệ</p>';
            return;
        }
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--gray-500);">Không tìm thấy sự kiện nào</p>';
            return;
        }
        
        // Load favorite status for each event
        const user = getCurrentUser();
        if (user) {
            try {
                const favoritesResponse = await API.getFavoriteEvents();
                const favoriteEvents = Array.isArray(favoritesResponse) 
                    ? favoritesResponse 
                    : (favoritesResponse?.events || favoritesResponse?.data || []);
                const favoriteIds = new Set(favoriteEvents.map(e => e.Event_ID || e.event_id));
                
                events = events.map(event => ({
                    ...event,
                    isFavorite: favoriteIds.has(event.Event_ID)
                }));
            } catch (error) {
                console.warn('Could not load favorites:', error);
            }
        }
        
        container.innerHTML = events.map(event => createEventCard(event)).join('');
        console.log('✅ Đã hiển thị sự kiện thành công');
    } catch (error) {
        console.error('❌ Lỗi khi tải sự kiện:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        container.innerHTML = `<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--danger-color);">Lỗi khi tải sự kiện: ${error.message}</p>`;
    }
}

// Create event card HTML
function createEventCard(event) {
    const imageHtml = event.Image_URL 
        ? `<div style="position: relative; width: 100%; height: 200px; overflow: hidden;">
             <img src="${getImageUrl(event.Image_URL)}" alt="${event.Event_Name}" class="event-image" 
                  onerror="this.onerror=null; this.style.display='none'; this.parentElement.querySelector('.event-placeholder').style.display='flex';">
             <div class="event-placeholder" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 3rem; background-color: var(--gray-100);">📅</div>
           </div>`
        : `<div class="event-placeholder">📅</div>`;
    
    const user = getCurrentUser();
    const isFavorite = event.isFavorite || false;
    
    return `
        <div class="card event-card" style="position: relative;">
            ${imageHtml}
            ${user ? `
            <button onclick="event.stopPropagation(); toggleFavorite('${event.Event_ID}', this)" 
                    class="favorite-btn" 
                    style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.9); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s;"
                    onmouseover="this.style.background='rgba(255, 255, 255, 1)'"
                    onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'">
                <svg width="20" height="20" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="${isFavorite ? '#ef4444' : 'currentColor'}" viewBox="0 0 24 24" style="color: ${isFavorite ? '#ef4444' : 'var(--gray-600)'};">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </button>
            ` : ''}
            <div onclick="window.location.href='/pages/event-detail.html?id=${event.Event_ID}'" style="cursor: pointer;">
                <h3 class="event-title">${event.Event_Name}</h3>
                <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${event.Description || ''}
                </p>
                <div class="event-info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>${formatDate(event.Start_DateTime)}</span>
                </div>
                ${event.Address ? `
                <div class="event-info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${event.Address}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
                    <span class="event-price">${formatCurrency(event.Price_Ticket)}</span>
                    <span style="color: var(--gray-500); font-size: 0.875rem;">Còn ${event.Quantity} vé</span>
                </div>
            </div>
        </div>
    `;
}

// Toggle favorite
async function toggleFavorite(eventId, buttonElement) {
    const user = getCurrentUser();
    if (!user) {
        showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
        return;
    }
    
    try {
        await API.toggleFavorite(eventId);
        const svg = buttonElement.querySelector('svg');
        const isCurrentlyFavorite = svg.getAttribute('fill') === '#ef4444';
        
        if (isCurrentlyFavorite) {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.style.color = 'var(--gray-600)';
            showToast('Đã xóa khỏi yêu thích', 'success');
        } else {
            svg.setAttribute('fill', '#ef4444');
            svg.setAttribute('stroke', '#ef4444');
            svg.style.color = '#ef4444';
            showToast('Đã thêm vào yêu thích', 'success');
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        showToast('Có lỗi xảy ra', 'error');
    }
}

// Load event detail
async function loadEventDetail(eventId) {
    try {
        console.log('📤 Đang tải chi tiết sự kiện:', eventId);
        const response = await API.getEventById(eventId);
        console.log('📥 Response nhận được:', response);
        
        // Cấu trúc response: { success: true, data: {...} }
        let event = null;
        if (response?.data) {
            event = response.data;
        } else if (response && typeof response === 'object' && !Array.isArray(response)) {
            event = response;
        } else {
            console.error('❌ Response không hợp lệ:', response);
            showToast('Không thể tải thông tin sự kiện', 'error');
            return;
        }
        
        console.log('✅ Event data:', event);
        await displayEventDetail(event);
    } catch (error) {
        console.error('❌ Lỗi khi tải chi tiết sự kiện:', error);
        showToast('Không thể tải thông tin sự kiện', 'error');
    }
}

// Display event detail
async function displayEventDetail(event) {
    const container = document.getElementById('event-detail-container');
    if (!container) return;
    
    const user = getCurrentUser();
    const isOwner = user && (event.User_ID === user.User_ID || event.user_id === user.User_ID);
    
    const imageHtml = event.Image_URL
        ? `<div style="position: relative; width: 100%; height: 400px; margin-bottom: 2rem; border-radius: 0.75rem; overflow: hidden;">
             <img src="${getImageUrl(event.Image_URL)}" alt="${event.Event_Name}" style="width: 100%; height: 100%; object-fit: cover;" 
                  onerror="this.onerror=null; this.style.display='none'; this.parentElement.querySelector('.event-placeholder').style.display='flex';">
             <div class="event-placeholder" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 4rem; background-color: var(--gray-100);">📅</div>
           </div>`
        : `<div class="event-placeholder" style="height: 400px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; font-size: 4rem; background-color: var(--gray-100); border-radius: 0.75rem;">📅</div>`;
    
    // Check if user has favorited this event
    let isFavorite = false;
    if (user && !isOwner) {
        try {
            const favoritesResponse = await API.getFavoriteEvents();
            const favoriteEvents = Array.isArray(favoritesResponse) 
                ? favoritesResponse 
                : (favoritesResponse?.events || favoritesResponse?.data || []);
            const favoriteIds = new Set(favoriteEvents.map(e => e.Event_ID || e.event_id));
            isFavorite = favoriteIds.has(event.Event_ID);
        } catch (error) {
            console.warn('Could not load favorite status:', error);
        }
    }
    
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 100%; overflow-x: hidden;">
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <div style="min-width: 0;">
                    ${imageHtml}
                    <div class="card" style="position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <h1 style="font-size: 2rem; font-weight: bold; flex: 1; min-width: 0;">${event.Event_Name}</h1>
                            ${user && !isOwner ? `
                            <button onclick="toggleFavorite('${event.Event_ID}', this)" 
                                    class="favorite-btn" 
                                    style="position: relative; background: rgba(255, 255, 255, 0.9); border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s; margin-left: 1rem; flex-shrink: 0;"
                                    onmouseover="this.style.background='rgba(255, 255, 255, 1)'"
                                    onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'">
                                <svg width="24" height="24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="${isFavorite ? '#ef4444' : 'currentColor'}" viewBox="0 0 24 24" style="color: ${isFavorite ? '#ef4444' : 'var(--gray-600)'};">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </button>
                            ` : ''}
                        </div>
                        <p style="color: var(--gray-700); line-height: 1.8; margin-bottom: 2rem; word-wrap: break-word;">${event.Description || ''}</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="display: flex; align-items: start; gap: 0.75rem;">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary-color); margin-top: 0.25rem; flex-shrink: 0;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <div style="min-width: 0;">
                                    <p style="font-weight: 600;">Thời gian</p>
                                    <p style="color: var(--gray-600); word-wrap: break-word;">${formatDate(event.Start_DateTime)} - ${formatTime(event.End_DateTime)}</p>
                                </div>
                            </div>
                            ${event.Address ? `
                            <div style="display: flex; align-items: start; gap: 0.75rem;">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary-color); margin-top: 0.25rem; flex-shrink: 0;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <div style="min-width: 0;">
                                    <p style="font-weight: 600;">Địa điểm</p>
                                    <p style="color: var(--gray-600); word-wrap: break-word;">${event.Address}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${event.Address ? `
                    <div class="card" style="overflow: hidden;">
                        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Vị trí trên bản đồ</h2>
                        <div id="map" style="width: 100%; height: 400px; border-radius: 0.5rem; min-height: 400px;"></div>
                    </div>
                    ` : ''}
                </div>
                
                <div style="min-width: 0;">
                    <div class="card" style="position: sticky; top: 100px;">
                        <div style="margin-bottom: 1.5rem;">
                            <p style="font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 0.5rem;">
                                ${formatCurrency(event.Price_Ticket)}
                            </p>
                            <p style="color: var(--gray-600);">mỗi vé</p>
                        </div>
                        
                        ${isOwner ? `
                        <button onclick="window.location.href='/pages/create-event.html?id=${event.Event_ID}'" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            Chỉnh sửa sự kiện
                        </button>
                        <button disabled class="btn btn-secondary" style="width: 100%; margin-bottom: 1rem; opacity: 0.6; cursor: not-allowed;">
                            Mua vé ngay (Không thể mua vé của sự kiện do bạn tạo)
                        </button>
                        ` : `
                        <button onclick="window.location.href='/pages/buy-ticket.html?id=${event.Event_ID}'" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            Mua vé ngay
                        </button>
                        `}
                        
                        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
                            <h3 style="font-weight: 600; margin-bottom: 0.75rem;">Thông tin sự kiện</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--gray-600);">Danh mục:</span>
                                    <span style="font-weight: 600;">${event.Category_Name || 'N/A'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--gray-600);">Vé còn lại:</span>
                                    <span style="font-weight: 600;">${event.Quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load Google Maps if address exists
    if (event.Address) {
        loadGoogleMap(event.Address);
    }
}

// Load Google Maps
function loadGoogleMap(address) {
    // This requires Google Maps API to be loaded
    if (typeof google !== 'undefined' && google.maps) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: results[0].geometry.location,
                });
                
                new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                });
            }
        });
    }
}

