# Script to start the mobile app and show QR code
Write-Host "Starting Expo development server..." -ForegroundColor Green
Write-Host ""

Set-Location mobile-app

# Start Expo with tunnel mode for better connectivity
Write-Host "Starting Expo with tunnel mode..." -ForegroundColor Yellow
Write-Host "This will show a QR code you can scan with Expo Go app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npx expo start --tunnel

