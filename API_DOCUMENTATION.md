# Tài liệu API đầy đủ - Event Management System

## Base URLs

### API Gateway (Public)
```
http://localhost:8000/api
```

### Static Files
```
http://localhost:8000/uploads
```

### Service URLs (Internal)
- **Auth Service**: `http://localhost:3001` (Docker: `http://auth-service:3001`)
- **User Service**: `http://localhost:3002` (Docker: `http://user-service:3002`)
- **Event Service**: `http://localhost:3003` (Docker: `http://event-service:3003`)
- **Payment Service**: `http://localhost:3004` (Docker: `http://payment-service:3004`)
- **Notification Service**: `http://localhost:3005` (Docker: `http://notification-service:3005`)
- **OTP Service**: `http://localhost:3006` (Docker: `http://otp-service:3006`)

---

## Authentication

Tất cả các request (trừ login, register, refresh, verify) cần header:
```
Authorization: Bearer {token}
```

---

## 1. Authentication APIs (`/api/auth`)

### POST `/api/auth/login`
Đăng nhập người dùng

**Request Body:**
```json
{
  "account": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_string",
  "user": {
    "User_ID": "string",
    "FullName": "string",
    "Account": "string",
    "Gmail": "string",
    "Phone": "string",
    "Address": "string",
    "Birthday": "date",
    "Sex": "string",
    "Amount": 0.00,
    "Avatar_URL": "string"
  }
}
```

---

### POST `/api/auth/register`
Đăng ký người dùng mới

**Request Body:**
```json
{
  "FullName": "string",
  "Account": "string",
  "Gmail": "string",
  "Phone": "string",
  "Address": "string",
  "Birthday": "date",
  "Sex": "string",
  "Password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { ... }
}
```

---

### POST `/api/auth/refresh`
Làm mới access token

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token_string"
}
```

---

### POST `/api/auth/verify`
Xác thực access token

**Request Body:**
```json
{
  "token": "jwt_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": { ... }
}
```

---

### POST `/api/auth/logout`
Đăng xuất (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`
Lấy thông tin người dùng hiện tại (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### PUT `/api/auth/change-password`
Đổi mật khẩu (Yêu cầu authentication)

**Request Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. OTP APIs (`/api/otp`)

### POST `/api/otp/send`
Gửi mã OTP

**Request Body:**
```json
{
  "email": "string",
  "type": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### POST `/api/otp/verify`
Xác thực mã OTP

**Request Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

## 3. User APIs (`/api/users`)

### GET `/api/users/:id`
Lấy thông tin user theo ID (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "data": {
    "User_ID": "string",
    "FullName": "string",
    "Account": "string",
    "Gmail": "string",
    "Phone": "string",
    "Address": "string",
    "Birthday": "date",
    "Sex": "string",
    "Amount": 0.00,
    "Avatar_URL": "string"
  }
}
```

---

### GET `/api/users/account/:account`
Lấy thông tin user theo account (Yêu cầu authentication)

**Response:** Tương tự GET `/api/users/:id`

---

### POST `/api/users`
Tạo user mới (Yêu cầu authentication)

**Request Body:**
```json
{
  "FullName": "string",
  "Account": "string",
  "Gmail": "string",
  "Phone": "string",
  "Address": "string",
  "Birthday": "date",
  "Sex": "string",
  "Password": "string"
}
```

---

### PUT `/api/users/:id`
Cập nhật thông tin user (Yêu cầu authentication)

**Request:** FormData
- `FullName`: string
- `Phone`: string
- `Address`: string
- `Birthday`: date
- `Sex`: string
- `avatar`: File (optional)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### POST `/api/users/:id/avatar`
Upload avatar (Yêu cầu authentication)

**Request:** FormData
- `avatar`: File (image)

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatarUrl": "/uploads/avatars/filename.jpg"
}
```

---

### GET `/api/users/:id/balance`
Lấy số dư của user (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "balance": 0.00
}
```

---

### PUT `/api/users/:id/balance`
Cập nhật số dư (Nạp tiền) (Yêu cầu authentication)

**Request Body:**
```json
{
  "amount": 0.00,
  "type": "topup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Balance updated successfully",
  "newBalance": 0.00
}
```

---

### PUT `/api/users/:id/password`
Đổi mật khẩu user (Yêu cầu authentication)

**Request Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

---

## 4. Event APIs (`/api/events`)

### GET `/api/events`
Lấy danh sách sự kiện

**Query Parameters:**
- `search`: string (tìm kiếm theo tên, mô tả)
- `category`: string (Category_ID)
- `page`: number (số trang)
- `limit`: number (số lượng mỗi trang)
- `my_events`: boolean (true để lấy sự kiện của user hiện tại)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Event_ID": "string",
      "Event_Name": "string",
      "Description": "string",
      "Start_DateTime": "datetime",
      "End_DateTime": "datetime",
      "Price_Ticket": 0.00,
      "Quantity": 0,
      "Available_Quantity": 0,
      "Address": "string",
      "Image_URL": "/uploads/event/filename.jpg",
      "Category_ID": "string",
      "Category_Name": "string",
      "User_ID": "string",
      "Status": "active|inactive",
      "Artists": [
        {
          "Artist_ID": "string",
          "Artist_Name": "string"
        }
      ]
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 10
}
```

---

### GET `/api/events/:id`
Lấy chi tiết sự kiện

**Response:**
```json
{
  "success": true,
  "data": {
    "Event_ID": "string",
    "Event_Name": "string",
    "Description": "string",
    "Start_DateTime": "datetime",
    "End_DateTime": "datetime",
    "Price_Ticket": 0.00,
    "Quantity": 0,
    "Available_Quantity": 0,
    "Address": "string",
    "Image_URL": "/uploads/event/filename.jpg",
    "Category_ID": "string",
    "Category_Name": "string",
    "User_ID": "string",
    "Status": "active|inactive",
    "Artists": [...]
  }
}
```

---

### POST `/api/events`
Tạo sự kiện mới (Yêu cầu authentication)

**Request:** FormData
- `Event_Name`: string (required)
- `Description`: string
- `Start_DateTime`: datetime (required, format: `YYYY-MM-DD HH:mm:ss`)
- `End_DateTime`: datetime (required, format: `YYYY-MM-DD HH:mm:ss`)
- `Price_Ticket`: number (required)
- `Quantity`: number (required)
- `Address`: string (required)
- `Category_ID`: string (required)
- `User_ID`: string (required)
- `image`: File (optional, image file)

**Response:**
```json
{
  "success": true,
  "data": {
    "Event_ID": "string",
    ...
  }
}
```

---

### PUT `/api/events/:id`
Cập nhật sự kiện (Yêu cầu authentication)

**Request:** FormData (tương tự POST, tất cả fields optional trừ khi cần update)
- `Event_Name`: string
- `Description`: string
- `Start_DateTime`: datetime
- `End_DateTime`: datetime
- `Price_Ticket`: number
- `Quantity`: number
- `Address`: string
- `Category_ID`: string
- `image`: File (optional, nếu có sẽ thay thế ảnh cũ)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### DELETE `/api/events/:id`
Xóa sự kiện (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### GET `/api/events/:id/availability`
Kiểm tra số lượng vé còn lại

**Response:**
```json
{
  "success": true,
  "available": 0,
  "total": 0
}
```

---

### PUT `/api/events/:id/availability`
Cập nhật số lượng vé (Yêu cầu authentication)

**Request Body:**
```json
{
  "quantity": 0
}
```

---

## 5. Category APIs (`/api/categories`)

### GET `/api/categories`
Lấy danh sách tất cả danh mục

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Category_ID": "string",
      "Category_Name": "string"
    }
  ]
}
```

---

## 6. Artist APIs (`/api/artists`)

### GET `/api/artists`
Lấy danh sách tất cả nghệ sĩ

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Artist_ID": "string",
      "Artist_Name": "string",
      "Email": "string",
      "Phone": "string",
      "Image_URL": "string"
    }
  ]
}
```

---

### GET `/api/artists/:id`
Lấy thông tin nghệ sĩ theo ID

**Response:**
```json
{
  "success": true,
  "data": {
    "Artist_ID": "string",
    "Artist_Name": "string",
    "Email": "string",
    "Phone": "string",
    "Image_URL": "string"
  }
}
```

---

## 7. Payment APIs (`/api/payments`)

### POST `/api/payments/create`
Tạo payment session (Yêu cầu authentication)

**Request Body:**
```json
{
  "event_id": "string",
  "ticket_ids": ["string"],
  "user_id": "string"
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "string",
  "user_id": "string",
  "event_id": "string",
  "ticket_ids": ["string"],
  "amount": 0.00,
  "expires_at": "datetime"
}
```

---

### POST `/api/payments/process`
Xử lý thanh toán (Yêu cầu authentication)

**Request Body:**
```json
{
  "session_id": "string",
  "otp": "string",
  "payment_method": "wallet|card"
}
```

**Response:**
```json
{
  "success": true,
  "status": "success|failed",
  "transaction_id": "string",
  "amount": 0.00,
  "message": "Payment processed successfully"
}
```

---

### GET `/api/payments/:id/status`
Lấy trạng thái thanh toán (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "status": "pending|completed|failed|refunded",
  "transaction_id": "string",
  "amount": 0.00
}
```

---

### GET `/api/payments/user/:id/transactions`
Lấy lịch sử giao dịch của user (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "transaction_id": "string",
      "user_id": "string",
      "event_id": "string",
      "amount": 0.00,
      "status": "pending|completed|failed|refunded",
      "payment_method": "string",
      "type": "payment|topup|refund",
      "created_at": "datetime"
    }
  ]
}
```

---

### GET `/api/payments/tickets/user/:id`
Lấy danh sách vé đã mua của user (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Purchased_ID": "string",
      "Ticket_ID": "string",
      "User_ID": "string",
      "Date_Purchase": "datetime",
      "QR_Code": "string",
      "CheckIn_Status": 0|1,
      "Event": { ... },
      "Ticket": { ... }
    }
  ]
}
```

---

### GET `/api/payments/tickets/:id`
Lấy chi tiết vé (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "data": {
    "Purchased_ID": "string",
    "Ticket_ID": "string",
    "User_ID": "string",
    "Date_Purchase": "datetime",
    "QR_Code": "string",
    "CheckIn_Status": 0|1,
    "Event": { ... },
    "Ticket": { ... }
  }
}
```

---

## 8. Notification APIs (`/api/notifications`)

### GET `/api/notifications/user/:id`
Lấy danh sách thông báo của user (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "notification_id": "string",
      "user_id": "string",
      "title": "string",
      "message": "string",
      "type": "string",
      "status": "unread|read",
      "created_at": "datetime",
      "read_at": "datetime"
    }
  ]
}
```

---

### PUT `/api/notifications/:id/read`
Đánh dấu thông báo đã đọc (Yêu cầu authentication)

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 9. Health Check

### GET `/health`
Kiểm tra trạng thái API Gateway

**Response:**
```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

---

## 10. Static Files

### GET `/uploads/event/:filename`
Lấy file ảnh sự kiện

**Example:**
```
http://localhost:8000/uploads/event/event-1234567890-123456789.jpg
```

---

### GET `/uploads/avatars/:filename`
Lấy file ảnh đại diện user

**Example:**
```
http://localhost:8000/uploads/avatars/avatar-1234567890-123456789.jpg
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

---

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Notes

1. **DateTime Format**: `YYYY-MM-DD HH:mm:ss` hoặc ISO 8601
2. **File Upload**: Sử dụng `multipart/form-data` cho các request có file
3. **JWT Token**: Có thời hạn, cần refresh khi hết hạn
4. **OTP**: Có thời hạn (thường 5-10 phút)
5. **Payment Session**: Có thời hạn (thường 15-30 phút)
6. **CORS**: API Gateway cho phép tất cả origins trong môi trường development
7. **File Size Limit**: 10MB cho image uploads
8. **Image Formats**: Chỉ chấp nhận file ảnh (image/*)

---

## Frontend API Usage

Tất cả các API được gọi thông qua object `API` trong `UI/js/api.js`:

```javascript
// Example usage
await API.login(account, password);
await API.getEvents({ search: 'music', category: 'DM01' });
await API.createEvent(formData);
await API.updateEvent(eventId, formData);
await API.getUser(userId);
await API.updateUser(userId, formData);
await API.createPaymentSession(eventId, ticketIds);
await API.processPayment(sessionId, otp, 'wallet');
```

---

## Service Ports Summary

| Service | Port | Docker Service Name |
|---------|------|---------------------|
| API Gateway | 8000 | api-gateway |
| Auth Service | 3001 | auth-service |
| User Service | 3002 | user-service |
| Event Service | 3003 | event-service |
| Payment Service | 3004 | payment-service |
| Notification Service | 3005 | notification-service |
| OTP Service | 3006 | otp-service |

---

*Tài liệu này được tạo tự động dựa trên codebase hiện tại. Có thể có một số endpoints chưa được implement hoặc có thay đổi.*

