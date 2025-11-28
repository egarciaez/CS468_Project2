# Script to show QR code and connection info for Expo

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Study Coach - Mobile App Connection" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Get local IP
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"
} | Select-Object IPAddress, InterfaceAlias

if ($ipAddresses) {
    $mainIP = ($ipAddresses | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*"} | Select-Object -First 1).IPAddress
    if (-not $mainIP) {
        $mainIP = ($ipAddresses | Select-Object -First 1).IPAddress
    }
} else {
    $mainIP = "YOUR_IP_HERE"
}

Write-Host "📱 Connection Information:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your Computer IP: $mainIP" -ForegroundColor Cyan
Write-Host "Backend URL: http://$mainIP:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Expo Dev Server URLs:" -ForegroundColor Yellow
Write-Host "  - Metro Bundler: http://localhost:8081" -ForegroundColor White
Write-Host "  - Expo DevTools: http://localhost:19000" -ForegroundColor White
Write-Host "  - Expo Go (LAN): exp://$mainIP:8081" -ForegroundColor White
Write-Host ""
Write-Host "📲 To Connect Your Phone:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Install Expo Go app:" -ForegroundColor White
Write-Host "   iOS: https://apps.apple.com/app/expo-go/id982107779" -ForegroundColor Cyan
Write-Host "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Make sure your phone is on the same WiFi network" -ForegroundColor White
Write-Host ""
Write-Host "3. Open Expo Go app and:" -ForegroundColor White
Write-Host "   - Tap 'Enter URL manually'" -ForegroundColor Cyan
Write-Host "   - Enter: exp://$mainIP:8081" -ForegroundColor Green
Write-Host "   - Or scan the QR code from the terminal where 'npm start' is running" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Test backend connection from phone browser:" -ForegroundColor White
Write-Host "   http://$mainIP:8000/" -ForegroundColor Green
Write-Host ""
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "💡 Tip: Check the terminal where you ran 'npm start' for the QR code!" -ForegroundColor Yellow
Write-Host "   The QR code should appear automatically in that terminal window.`n" -ForegroundColor Yellow

