# Start Expo with visible output showing QR code and connection URL
# This script ensures you can see the QR code and connection information

Write-Host "Starting Expo development server..." -ForegroundColor Green
Write-Host "Look for the QR code and connection URL below:" -ForegroundColor Yellow
Write-Host ""

cd mobile-app

# Start Expo and keep output visible
npx expo start --clear

