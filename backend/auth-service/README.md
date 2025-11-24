# Auth Service

Authentication and Authorization Service cho Event Management System.

## Features

- User login với JWT tokens
- User registration
- Token refresh mechanism
- Password change
- Session management
- Token blacklisting

## API Endpoints

### Public Endpoints

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify` - Verify token

### Protected Endpoints

- `POST /auth/logout` - Đăng xuất
- `GET /auth/me` - Lấy thông tin user hiện tại
- `PUT /auth/change-password` - Đổi mật khẩu

## Environment Variables

Xem file `.env.example` để biết các biến môi trường cần thiết.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

