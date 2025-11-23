# Kiến trúc Microservices cho Event Management System

## Tổng quan
Dự án Event Management được xây dựng theo kiến trúc microservices với 6 service chính: auth_service, event_service, payment_service, notifications_service, user_service, và send_otp_service.

## 1. Kiến trúc tổng thể

### 1.1. Service Communication
- **API Gateway**: Sử dụng Kong, Zuul, hoặc Spring Cloud Gateway để quản lý routing và load balancing
- **Service Discovery**: Consul, Eureka, hoặc Kubernetes Service Discovery
- **Message Queue**: RabbitMQ hoặc Apache Kafka cho asynchronous communication
- **API Communication**: RESTful APIs cho synchronous, Message Queue cho asynchronous

### 1.2. Database Strategy
- **Database per Service**: Mỗi service có database riêng để đảm bảo độc lập
- **Event Sourcing**: Sử dụng cho payment_service để track transactions
- **CQRS**: Tách biệt read/write models cho event_service

## 2. Chi tiết từng Service

### 2.1. Auth Service (`auth_service`)
**Trách nhiệm:**
- Xác thực người dùng (login/logout)
- Quản lý JWT tokens (access token, refresh token)
- Phân quyền và authorization (RBAC)
- OAuth2/SSO integration

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Java (Spring Boot Security)
- JWT (jsonwebtoken)
- Redis cho token storage và session management
- bcrypt cho password hashing

**Database Schema:**
```sql
- sessions (session_id, user_id, token, expires_at)
- refresh_tokens (token_id, user_id, token, expires_at)
- permissions (permission_id, name, description)
- user_roles (user_id, role_id)
```

**API Endpoints:**
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify` - Verify token
- `GET /auth/permissions` - Lấy permissions của user

**Integration:**
- Gọi `user_service` để validate user credentials
- Gọi `send_otp_service` cho 2FA (nếu cần)

---

### 2.2. User Service (`user_service`)
**Trách nhiệm:**
- Quản lý thông tin người dùng (CRUD)
- Profile management
- User preferences và settings

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Java (Spring Boot)
- MySQL/PostgreSQL cho user data
- Redis cho caching
- Multer (Node.js) hoặc Spring MultipartFile (Java) cho file upload
- File storage: Local storage hoặc AWS S3/Cloudinary cho production

**Database Schema:**
```sql
- users (User_ID, FullName, Birthday, Sex, Address, Phone, Gmail, Avatar_URL, Amount, Account, Password)
- user_preferences (user_id, preference_key, preference_value)
- user_profiles (user_id, bio, etc.)
```

**API Endpoints:**
- `GET /users/:id` - Lấy thông tin user
- `PUT /users/:id` - Cập nhật thông tin user
- `POST /users` - Tạo user mới
- `GET /users/:id/preferences` - Lấy preferences
- `PUT /users/:id/password` - Đổi mật khẩu (hash password)
- `POST /users/:id/avatar` - Upload avatar (lưu vào thư mục uploads/avatars/)
- `GET /users/:id/balance` - Lấy số dư tài khoản
- `PUT /users/:id/balance` - Cập nhật số dư (nạp tiền/rút tiền)

**Integration:**
- Được gọi bởi `auth_service` để validate credentials
- Gửi events đến message queue khi user được tạo/cập nhật

---

### 2.3. Event Service (`event_service`)
**Trách nhiệm:**
- Quản lý sự kiện (CRUD)
- Tìm kiếm và filter events
- Quản lý tickets và availability
- Event categories và artists

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Java (Spring Boot)
- MySQL/PostgreSQL cho event data
- Elasticsearch cho search functionality
- Redis cho caching popular events
- Multer (Node.js) hoặc Spring MultipartFile (Java) cho file upload
- File storage: Local storage (uploads/events/) hoặc AWS S3/Cloudinary cho production

**Database Schema:**
```sql
- events (Event_ID, Event_Name, Description, Start_DateTime, End_DateTime, Price_Ticket, Quantity, Address, Image_URL, User_ID, Category_ID)
- categories (Category_ID, Category_Name)
- artists (Artist_ID, Artist_Name, Email, Phone, Image_URL)
- event_artists (Event_ID, Artist_ID)
- tickets (Ticket_ID, Ticket_Name, Event_ID)
```

**API Endpoints:**
- `GET /events` - Danh sách events (với pagination, filter)
- `GET /events/:id` - Chi tiết event
- `POST /events` - Tạo event mới
- `PUT /events/:id` - Cập nhật event
- `DELETE /events/:id` - Xóa event
- `GET /events/search?q=...` - Tìm kiếm events
- `GET /events/:id/availability` - Kiểm tra số lượng vé còn lại
- `POST /events/:id/reserve` - Reserve tickets (tạm giữ)
- `POST /events/:id/image` - Upload ảnh sự kiện (lưu vào thư mục uploads/events/)
- `DELETE /events/:id/image` - Xóa ảnh sự kiện
- `GET /artists` - Danh sách artists
- `GET /artists/:id` - Chi tiết artist
- `POST /artists` - Tạo artist mới
- `PUT /artists/:id` - Cập nhật artist
- `POST /artists/:id/image` - Upload ảnh artist (lưu vào thư mục uploads/artists/)
- `DELETE /artists/:id/image` - Xóa ảnh artist

**Integration:**
- Gửi events đến `notifications_service` khi event được tạo/cập nhật
- Gửi events đến `payment_service` khi có booking

---

### 2.4. Payment Service (`payment_service`)
**Trách nhiệm:**
- Xử lý thanh toán (payment processing)
- Quản lý transactions
- Tích hợp payment gateways (VNPay, MoMo, Stripe)
- Refund handling

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Java (Spring Boot)
- PostgreSQL với Event Sourcing
- Redis cho payment session
- Message queue cho async processing

**Database Schema:**
```sql
- transactions (transaction_id, user_id, event_id, amount, status, payment_method, created_at)
- payment_sessions (session_id, user_id, event_id, ticket_ids, amount, expires_at)
- refunds (refund_id, transaction_id, amount, reason, status)
```

**API Endpoints:**
- `POST /payments/create` - Tạo payment session
- `POST /payments/process` - Xử lý thanh toán
- `GET /payments/:id/status` - Kiểm tra trạng thái thanh toán
- `POST /payments/:id/refund` - Hoàn tiền
- `GET /payments/user/:id` - Lịch sử thanh toán của user

**Integration:**
- Gọi `event_service` để validate event và tickets
- Gọi `user_service` để lấy thông tin user
- Gửi events đến `notifications_service` khi payment thành công/thất bại
- Gửi events đến message queue để update ticket status

---

### 2.5. Notifications Service (`notifications_service`)
**Trách nhiệm:**
- Gửi thông báo đa kênh (email, SMS, push notification, in-app)
- Quản lý notification templates
- Notification preferences của user
- Notification history

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Java (Spring Boot)
- MongoDB cho notification logs
- Redis cho notification queue
- AWS SNS, Firebase Cloud Messaging, SendGrid

**Database Schema:**
```sql
- notifications (notification_id, user_id, type, title, content, status, created_at)
- notification_templates (template_id, type, subject, body)
- user_notification_preferences (user_id, email_enabled, sms_enabled, push_enabled)
```

**API Endpoints:**
- `POST /notifications/send` - Gửi notification
- `GET /notifications/user/:id` - Lịch sử notifications của user
- `PUT /notifications/:id/read` - Đánh dấu đã đọc
- `GET /notifications/templates` - Lấy templates

**Integration:**
- Subscribe to message queue events từ các services khác
- Gọi `send_otp_service` cho OTP notifications
- Gọi `user_service` để lấy user preferences

---

### 2.6. Send OTP Service (`send_otp_service`)
**Trách nhiệm:**
- Tạo và gửi OTP codes
- Validate OTP codes
- Quản lý OTP expiration và rate limiting
- Tích hợp với email/SMS providers

**Tech Stack đề xuất:**
- Node.js (Express) hoặc Python (FastAPI)
- Redis cho OTP storage (TTL)
- Twilio cho SMS, SendGrid cho Email

**Database Schema:**
```sql
- otp_codes (otp_id, user_id, code, type, expires_at, used, created_at)
```

**API Endpoints:**
- `POST /otp/send` - Gửi OTP (email/SMS)
- `POST /otp/verify` - Xác thực OTP
- `POST /otp/resend` - Gửi lại OTP

**Integration:**
- Được gọi bởi `auth_service` cho 2FA
- Được gọi bởi `user_service` cho password reset
- Được gọi bởi `notifications_service` cho OTP notifications

---

## 3. Infrastructure & DevOps

### 3.1. Containerization
- **Docker**: Containerize mỗi service
- **Docker Compose**: Cho development environment
- **Kubernetes**: Cho production (nếu scale lớn)

### 3.2. CI/CD Pipeline
- **GitHub Actions** hoặc **GitLab CI**
- Automated testing (unit, integration)
- Automated deployment
- Blue-green deployment strategy

### 3.3. Monitoring & Logging
- **Prometheus + Grafana**: Metrics và monitoring
- **ELK Stack** (Elasticsearch, Logstash, Kibana): Centralized logging
- **Jaeger** hoặc **Zipkin**: Distributed tracing
- **Health checks**: `/health` endpoint cho mỗi service

### 3.4. Security
- **API Gateway**: Rate limiting, authentication
- **HTTPS/TLS**: Tất cả communications
- **Secrets Management**: HashiCorp Vault hoặc AWS Secrets Manager
- **Input Validation**: Validate tất cả inputs
- **SQL Injection Prevention**: Sử dụng parameterized queries

---

## 4. Data Flow Examples

### 4.1. User Registration Flow
1. User gửi request đến API Gateway
2. API Gateway route đến `user_service`
3. `user_service` tạo user và hash password
4. `user_service` gửi event đến message queue
5. `send_otp_service` subscribe event và gửi OTP email
6. `notifications_service` gửi welcome notification

### 4.2. Event Booking Flow
1. User chọn event và tickets
2. `event_service` kiểm tra availability và reserve tickets
3. `payment_service` tạo payment session
4. User thanh toán
5. `payment_service` xử lý payment
6. `event_service` confirm tickets và tạo purchased_tickets
7. `notifications_service` gửi confirmation email với QR code
8. `event_service` update availability

### 4.3. Login Flow
1. User gửi credentials đến API Gateway
2. API Gateway route đến `auth_service`
3. `auth_service` gọi `user_service` để validate
4. `auth_service` tạo JWT tokens
5. `auth_service` lưu session vào Redis
6. Return tokens cho client

---

## 5. Technology Stack Recommendations

### Backend Services
- **Node.js + Express**: Cho các services cần high concurrency (notifications, OTP)
- **Java + Spring Boot**: Cho các services cần enterprise features (payment, event)
- **Python + FastAPI**: Cho các services cần ML/AI (recommendations, analytics)

### Databases
- **MySQL/PostgreSQL**: Cho structured data (users, events, payments)
- **MongoDB**: Cho unstructured data (notifications, logs)
- **Redis**: Cho caching và session storage
- **Elasticsearch**: Cho search functionality

### Message Queue
- **RabbitMQ**: Cho reliable message delivery
- **Apache Kafka**: Cho high-throughput event streaming

### Frontend
- **React** hoặc **Vue.js**: SPA
- **Next.js**: SSR nếu cần SEO
- **React Native**: Mobile app

---

## 6. Best Practices

### 6.1. Service Independence
- Mỗi service có database riêng
- Services communicate qua APIs hoặc message queue
- Không share code giữa services (trừ shared libraries)

### 6.2. Error Handling
- Standardized error responses
- Circuit breaker pattern (Hystrix, Resilience4j)
- Retry mechanism với exponential backoff
- Dead letter queue cho failed messages

### 6.3. Versioning
- API versioning: `/v1/events`, `/v2/events`
- Database migrations với version control
- Backward compatibility khi có thể

### 6.4. Testing
- Unit tests cho mỗi service
- Integration tests cho service interactions
- Contract testing (Pact) giữa services
- End-to-end tests cho critical flows

---

## 7. Scalability Considerations

### 7.1. Horizontal Scaling
- Stateless services để dễ scale
- Load balancer cho mỗi service
- Database read replicas

### 7.2. Caching Strategy
- Redis cache cho frequently accessed data
- CDN cho static assets
- Cache invalidation strategy

### 7.3. Database Optimization
- Indexing cho frequently queried fields
- Database partitioning nếu cần
- Connection pooling

---

## 8. Project Structure Example

```
event-management/
├── api-gateway/
├── auth-service/
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── user-service/
├── event-service/
├── payment-service/
├── notifications-service/
├── send-otp-service/
├── shared/
│   ├── common/
│   └── types/
├── docker-compose.yml
├── kubernetes/
└── docs/
```

---

## 9. Next Steps

1. **Phase 1**: Setup infrastructure (API Gateway, Message Queue, Databases)
2. **Phase 2**: Implement core services (auth, user, event)
3. **Phase 3**: Implement supporting services (payment, notifications, OTP)
4. **Phase 4**: Integration và testing
5. **Phase 5**: Deployment và monitoring setup
6. **Phase 6**: Performance optimization và scaling

---

## 10. Additional Recommendations

### 10.1. API Documentation
- **Swagger/OpenAPI** cho tất cả services
- **Postman Collection** cho testing

### 10.2. Code Quality
- **ESLint/Prettier** cho Node.js
- **SonarQube** cho code quality analysis
- **Pre-commit hooks** với Husky

### 10.3. Backup & Disaster Recovery
- Automated database backups
- Multi-region deployment nếu cần
- Disaster recovery plan

### 10.4. Analytics
- **Analytics Service**: Track user behavior, event popularity
- **Reporting Service**: Generate reports cho admins

---

## Kết luận

Kiến trúc microservices này cung cấp:
- **Scalability**: Dễ dàng scale từng service độc lập
- **Maintainability**: Code được tách biệt, dễ maintain
- **Reliability**: Service failure không ảnh hưởng toàn hệ thống
- **Technology Diversity**: Có thể dùng tech stack khác nhau cho từng service
- **Team Autonomy**: Mỗi team có thể làm việc độc lập trên service của mình

