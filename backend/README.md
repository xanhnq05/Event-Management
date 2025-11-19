# Event Management Backend - Microservices Architecture

## Cấu trúc dự án

```
backend/
├── api-gateway/          # API Gateway (Port 8080)
├── auth-service/         # Authentication Service (Port 8081)
├── event-service/        # Event Management Service (Port 8082)
├── user-service/         # User Management Service (Port 8083)
├── payment-service/      # Payment Service (Port 8084)
├── docker-compose.yml    # Docker Compose configuration
└── init.sql              # Database initialization script
```

## Yêu cầu

- Docker và Docker Compose
- Maven 3.9+
- Java 17+

## Cách chạy

### 1. Khởi động tất cả services với Docker Compose

```bash
cd backend
docker-compose up -d
```

Lệnh này sẽ:
- Khởi động MySQL database (port 3306)
- Khởi động tất cả microservices
- Tự động import database schema từ `init.sql`

### 2. Kiểm tra services đang chạy

```bash
docker-compose ps
```

### 3. Xem logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs một service cụ thể
docker-compose logs -f event-service
```

### 4. Dừng services

```bash
docker-compose down
```

## API Endpoints

### API Gateway (Port 8080)

Tất cả requests đều đi qua API Gateway:

- **Events**: `http://localhost:8080/api/events`
- **Auth**: `http://localhost:8080/api/auth`
- **Users**: `http://localhost:8080/api/users`
- **Payments**: `http://localhost:8080/api/payments`

### Event Service

- `GET /api/events` - Lấy tất cả events
- `GET /api/events/{id}` - Lấy event theo ID
- `GET /api/events/user/{userId}` - Lấy events theo user
- `GET /api/events/category/{categoryId}` - Lấy events theo category
- `POST /api/events` - Tạo event mới
- `PUT /api/events/{id}` - Cập nhật event
- `DELETE /api/events/{id}` - Xóa event

### Auth Service

- `POST /api/auth/login` - Đăng nhập
  ```json
  {
    "account": "username",
    "password": "password"
  }
  ```
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/user/{account}` - Lấy thông tin user

### Payment Service

- `POST /api/payments/purchase` - Mua vé
  ```json
  {
    "ticketId": "V01",
    "userId": "ND01"
  }
  ```
- `GET /api/payments/tickets/user/{userId}` - Lấy vé đã mua
- `POST /api/payments/checkin` - Check-in vé
  ```json
  {
    "qrCode": "uuid-qr-code"
  }
  ```

## Database

- **Host**: localhost:3306
- **Database**: qlsk
- **Username**: eventuser
- **Password**: eventpass
- **Root Password**: rootpassword

## Phát triển

### Chạy từng service riêng lẻ (không dùng Docker)

1. Đảm bảo MySQL đang chạy
2. Cập nhật `application.yml` với database connection
3. Chạy từng service:
   ```bash
   cd event-service
   mvn spring-boot:run
   ```

### Build Docker images

```bash
docker-compose build
```

## Troubleshooting

### MySQL không kết nối được

- Kiểm tra MySQL container đang chạy: `docker ps`
- Kiểm tra logs: `docker-compose logs mysql`
- Đảm bảo healthcheck đã pass trước khi services khác khởi động

### Port đã được sử dụng

- Thay đổi ports trong `docker-compose.yml`
- Hoặc dừng service đang sử dụng port đó

### Services không start

- Kiểm tra logs: `docker-compose logs [service-name]`
- Đảm bảo Java 17+ đã được cài đặt
- Kiểm tra Maven có thể build project


