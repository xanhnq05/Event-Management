# Event Management System

Hệ thống quản lý sự kiện với kiến trúc microservices và hỗ trợ offline cho Android app.

## Cấu trúc dự án

```
Event-Management/
├── android-app/          # Android application với offline support
├── backend/              # Microservices backend
│   ├── api-gateway/
│   ├── auth-service/
│   ├── event-service/
│   ├── user-service/
│   └── payment-service/
└── qlsk.sql             # Database schema
```

## Tính năng

### Backend (Microservices)
- ✅ Event Service - Quản lý sự kiện
- ✅ Auth Service - Xác thực người dùng
- ✅ User Service - Quản lý người dùng
- ✅ Payment Service - Thanh toán và quản lý vé
- ✅ API Gateway - Điểm vào duy nhất cho tất cả API
- ✅ MySQL Database - Lưu trữ dữ liệu

### Android App
- ✅ Room Database - Lưu trữ offline
- ✅ Retrofit - Gọi API
- ✅ Offline-first pattern - Ưu tiên dữ liệu local
- ✅ Auto-sync - Tự động đồng bộ khi có mạng
- ✅ WorkManager - Đồng bộ background

## Hướng dẫn sử dụng

### 1. Khởi động Backend

```bash
cd backend
docker-compose up -d
```

Backend sẽ chạy tại:
- API Gateway: http://localhost:8080
- MySQL: localhost:3306

### 2. Cấu hình Android App

1. Mở project trong Android Studio
2. Cập nhật `BASE_URL` trong `Constants.java`:
   - Emulator: `http://10.0.2.2:8080/`
   - Thiết bị thật: `http://YOUR_IP:8080/`

3. Build và chạy app

### 3. Sử dụng Offline

- App sẽ tự động lưu dữ liệu vào Room database
- Khi offline, app sử dụng dữ liệu local
- Khi có mạng, app tự động sync với server
- Các thay đổi offline sẽ được đánh dấu và sync sau

## Database Schema

Database bao gồm các bảng:
- `user` - Người dùng
- `event` - Sự kiện
- `ticket` - Vé
- `purchasedticket` - Vé đã mua
- `artist` - Nghệ sĩ
- `category` - Danh mục
- `venue` - Địa điểm
- `eventartist` - Quan hệ event-artist

## API Documentation

Xem chi tiết tại [backend/README.md](backend/README.md)

## Công nghệ sử dụng

### Backend
- Spring Boot 3.2.0
- MySQL 8.0
- Docker & Docker Compose
- Maven

### Android
- Java 11
- Room Database
- Retrofit 2.9.0
- WorkManager
- OkHttp

## Phát triển

### Thêm service mới

1. Tạo thư mục service trong `backend/`
2. Thêm service vào `docker-compose.yml`
3. Cập nhật API Gateway để route requests

### Thêm offline support cho entity mới

1. Tạo Entity class trong `data/local/`
2. Tạo DAO interface
3. Thêm vào AppDatabase
4. Tạo Repository với offline-first pattern

## License

MIT


