# Event Management System - Frontend (HTML/CSS/JS)

Ứng dụng quản lý sự kiện với đầy đủ các tính năng được xây dựng bằng HTML, CSS và JavaScript thuần.

## Cấu trúc thư mục

```
EventManagement/
├── index.html              # Trang chủ
├── pages/                  # Các trang HTML
│   ├── login.html
│   ├── register.html
│   ├── events.html
│   ├── event-detail.html
│   ├── create-event.html
│   ├── buy-ticket.html
│   ├── payment.html
│   ├── tickets.html
│   ├── ticket-detail.html
│   ├── wallet.html
│   ├── transactions.html
│   ├── favorites.html
│   └── profile.html
├── css/                    # File CSS
│   ├── style.css          # CSS chính
│   └── components.css     # CSS cho components
├── js/                     # File JavaScript
│   ├── api.js             # API calls
│   ├── auth.js            # Authentication
│   ├── events.js          # Event management
│   ├── payment.js         # Payment processing
│   ├── utils.js           # Utility functions
│   └── main.js            # Main script
├── assets/                 # Images, icons
│   ├── images/
│   └── icons/
└── uploads/                # Uploaded files
    ├── events/
    ├── avatars/
    └── artists/
```

## Cài đặt và chạy

1. Mở project trong IntelliJ IDEA
2. Chạy backend bằng Docker (port 8000)
3. Mở file `index.html` trong browser hoặc dùng Live Server
4. Cấu hình API URL trong `js/api.js`

## Tính năng

- ✅ Đăng nhập/Đăng ký
- ✅ Tạo và quản lý sự kiện
- ✅ Tìm kiếm sự kiện
- ✅ Xem chi tiết sự kiện với Google Maps
- ✅ Mua vé và thanh toán
- ✅ OTP xác thực qua email
- ✅ QR Code cho vé
- ✅ Nạp tiền vào ví
- ✅ Lịch sử giao dịch
- ✅ Sự kiện yêu thích
- ✅ Quản lý profile

## API Endpoints

Backend cần cung cấp các endpoints tại `http://localhost:8000/api`:

- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- `/events` - Danh sách sự kiện
- `/events/:id` - Chi tiết sự kiện
- `/payments/create` - Tạo payment session
- `/payments/process` - Xử lý thanh toán
- Và nhiều endpoints khác...
