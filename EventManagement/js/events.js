// Event-related functions

// Load featured events
async function loadFeaturedEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    showLoading(container);
    
    try {
        const response = await API.getEvents({ limit: 6 });
        const events = response.events || response || [];
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--gray-500);">Không tìm thấy sự kiện nào</p>';
            return;
        }
        
        container.innerHTML = events.map(event => createEventCard(event)).join('');
    } catch (error) {
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
        
        const response = await API.getEvents(params);
        const events = response.events || response || [];
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--gray-500);">Không tìm thấy sự kiện nào</p>';
            return;
        }
        
        container.innerHTML = events.map(event => createEventCard(event)).join('');
    } catch (error) {
        container.innerHTML = `<p class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--danger-color);">Lỗi khi tải sự kiện: ${error.message}</p>`;
    }
}

// Create event card HTML
function createEventCard(event) {
    const imageHtml = event.Image_URL 
        ? `<img src="${event.Image_URL}" alt="${event.Event_Name}" class="event-image">`
        : `<div class="event-placeholder">📅</div>`;
    
    return `
        <div class="card event-card" onclick="window.location.href='/pages/event-detail.html?id=${event.Event_ID}'">
            ${imageHtml}
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
    `;
}

// Load event detail
async function loadEventDetail(eventId) {
    try {
        const event = await API.getEventById(eventId);
        displayEventDetail(event);
    } catch (error) {
        showToast('Không thể tải thông tin sự kiện', 'error');
        console.error(error);
    }
}

// Display event detail
function displayEventDetail(event) {
    const container = document.getElementById('event-detail-container');
    if (!container) return;
    
    const imageHtml = event.Image_URL
        ? `<img src="${event.Image_URL}" alt="${event.Event_Name}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 0.75rem; margin-bottom: 2rem;">`
        : `<div class="event-placeholder" style="height: 400px; margin-bottom: 2rem;">📅</div>`;
    
    container.innerHTML = `
        <div class="grid grid-1 lg:grid-3" style="gap: 2rem;">
            <div style="grid-column: span 2;">
                ${imageHtml}
                <div class="card">
                    <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">${event.Event_Name}</h1>
                    <p style="color: var(--gray-700); line-height: 1.8; margin-bottom: 2rem;">${event.Description || ''}</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; align-items: start; gap: 0.75rem;">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary-color); margin-top: 0.25rem;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <p style="font-weight: 600;">Thời gian</p>
                                <p style="color: var(--gray-600);">${formatDate(event.Start_DateTime)} - ${formatTime(event.End_DateTime)}</p>
                            </div>
                        </div>
                        ${event.Address ? `
                        <div style="display: flex; align-items: start; gap: 0.75rem;">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary-color); margin-top: 0.25rem;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div>
                                <p style="font-weight: 600;">Địa điểm</p>
                                <p style="color: var(--gray-600);">${event.Address}</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                ${event.Address ? `
                <div class="card">
                    <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Vị trí trên bản đồ</h2>
                    <div id="map" style="width: 100%; height: 400px; border-radius: 0.5rem;"></div>
                </div>
                ` : ''}
            </div>
            
            <div>
                <div class="card" style="position: sticky; top: 100px;">
                    <div style="margin-bottom: 1.5rem;">
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 0.5rem;">
                            ${formatCurrency(event.Price_Ticket)}
                        </p>
                        <p style="color: var(--gray-600);">mỗi vé</p>
                    </div>
                    
                    <button onclick="window.location.href='/pages/buy-ticket.html?id=${event.Event_ID}'" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                        Mua vé ngay
                    </button>
                    
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

