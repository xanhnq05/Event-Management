@echo off
echo ========================================
echo Installing Dependencies for All Services
echo ========================================
echo.

echo [1/8] Installing shared dependencies...
cd backend\shared
call npm install
cd ..\..

echo [2/8] Installing auth-service dependencies...
cd backend\auth-service
call npm install
cd ..\..

echo [3/8] Installing user-service dependencies...
cd backend\user-service
call npm install
cd ..\..

echo [4/8] Installing event-service dependencies...
cd backend\event-service
call npm install
cd ..\..

echo [5/8] Installing payment-service dependencies...
cd backend\payment-service
call npm install
cd ..\..

echo [6/8] Installing notification-service dependencies...
cd backend\notification-service
call npm install
cd ..\..

echo [7/8] Installing otp-service dependencies...
cd backend\otp-service
call npm install
cd ..\..

echo [8/8] Installing api-gateway dependencies...
cd backend\api-gateway
call npm install
cd ..\..

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
pause


