# Start Expo for Study Coach Mobile App
Write-Host "`n🚀 Starting Expo Development Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot\mobile-app

Write-Host "`n📍 Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "`nStarting Expo with:" -ForegroundColor White
Write-Host "  - Clear cache (--clear)" -ForegroundColor Gray
Write-Host "  - Tunnel mode (--tunnel)" -ForegroundColor Gray
Write-Host "  - Port 8082" -ForegroundColor Gray
Write-Host "`n⏳ Please wait for the QR code to appear...`n" -ForegroundColor Yellow

npx expo start --clear --tunnel --port 8082

