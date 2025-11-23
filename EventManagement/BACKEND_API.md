# Backend API Documentation cho Java

Tài liệu này mô tả các API endpoints mà frontend cần để hoạt động với backend Java.

## Base URL
```
http://localhost:8000/api
```

## Authentication

Tất cả các request (trừ login, register) cần header:
```
Authorization: Bearer {token}
```

## Endpoints

### 1. Authentication

#### POST `/auth/login`
Đăng nhập

**Request:**
```json
{
  "account": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "User_ID": "string",
    "FullName": "string",
    "Gmail": "string",
    "Amount": 0.00,
    ...
  }
}
```

#### POST `/auth/register`
Đăng ký

**Request:**
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

#### POST `/auth/logout`
Đăng xuất

#### GET `/auth/me`
Lấy thông tin user hiện tại

#### PUT `/auth/change-password`
Đổi mật khẩu

**Request:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### 2. OTP

#### POST `/otp/send`
Gửi OTP

**Request:**
```json
{
  "email": "string",
  "type": "email"
}
```

#### POST `/otp/verify`
Xác thực OTP

**Request:**
```json
{
  "email": "string",
  "code": "string"
}
```

### 3. Events

#### GET `/events`
Lấy danh sách sự kiện

**Query params:**
- `search`: string (tìm kiếm)
- `category`: string (Category_ID)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "events": [
    {
      "Event_ID": "string",
      "Event_Name": "string",
      "Description": "string",
      "Start_DateTime": "datetime",
      "End_DateTime": "datetime",
      "Price_Ticket": 0.00,
      "Quantity": 0,
      "Address": "string",
      "Image_URL": "string",
      "Category_ID": "string",
      "Category_Name": "string",
      "Artists": [...]
    }
  ]
}
```

#### GET `/events/{id}`
Lấy chi tiết sự kiện

#### POST `/events`
Tạo sự kiện mới

**Request:** FormData
- `Event_Name`: string
- `Description`: string
- `Start_DateTime`: datetime
- `End_DateTime`: datetime
- `Price_Ticket`: decimal
- `Quantity`: int
- `Address`: string
- `Category_ID`: string
- `image`: File (optional)

#### PUT `/events/{id}`
Cập nhật sự kiện

#### DELETE `/events/{id}`
Xóa sự kiện

#### GET `/events/categories`
Lấy danh sách danh mục

#### GET `/events/artists`
Lấy danh sách nghệ sĩ

#### POST `/events/{id}/favorite`
Thêm/xóa yêu thích

#### GET `/events/favorites`
Lấy danh sách sự kiện yêu thích

### 4. Users

#### GET `/users/{id}`
Lấy thông tin user

#### PUT `/users/{id}`
Cập nhật user

**Request:** FormData
- `FullName`: string
- `Phone`: string
- `Address`: string
- `Birthday`: date
- `Sex`: string
- `avatar`: File (optional)

#### GET `/users/balance`
Lấy số dư

**Response:**
```json
{
  "amount": 0.00
}
```

#### POST `/users/topup`
Nạp tiền

**Request:**
```json
{
  "amount": 0.00
}
```

#### GET `/users/transactions`
Lấy lịch sử giao dịch

**Response:**
```json
[
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
```

### 5. Payments

#### POST `/payments/create`
Tạo payment session

**Request:**
```json
{
  "event_id": "string",
  "ticket_ids": ["string"]
}
```

**Response:**
```json
{
  "session_id": "string",
  "user_id": "string",
  "event_id": "string",
  "ticket_ids": ["string"],
  "amount": 0.00,
  "expires_at": "datetime"
}
```

#### POST `/payments/process`
Xử lý thanh toán

**Request:**
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
  "status": "success|failed",
  "transaction_id": "string",
  "amount": 0.00
}
```

#### GET `/payments/{id}/status`
Lấy trạng thái thanh toán

#### GET `/payments/tickets`
Lấy danh sách vé đã mua

**Response:**
```json
[
  {
    "Purchased_ID": "string",
    "Ticket_ID": "string",
    "User_ID": "string",
    "Date_Purchase": "datetime",
    "QR_Code": "string",
    "CheckIn_Status": 0|1,
    "Event": {...},
    "Ticket": {...}
  }
]
```

#### GET `/payments/tickets/{id}`
Lấy chi tiết vé

## Error Response Format

```json
{
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Notes

1. Tất cả datetime format: `yyyy-MM-dd HH:mm:ss` hoặc ISO 8601
2. File upload sử dụng `multipart/form-data`
3. JWT token có thời hạn, cần refresh khi hết hạn
4. OTP có thời hạn (thường 5-10 phút)
5. Payment session có thời hạn (thường 15-30 phút)

