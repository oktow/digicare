Write-Host "=== Memulai DigiCare ===" -ForegroundColor Cyan

# 1. Cek MySQL jalan
$mysql = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Host "[1/3] MySQL belum jalan, menjalankan..." -ForegroundColor Yellow
    Start-Process -NoNewWindow -FilePath "C:\xampp\mysql\bin\mysqld.exe"
    Start-Sleep -Seconds 3
} else {
    Write-Host "[1/3] MySQL sudah jalan" -ForegroundColor Green
}

# 2. Backend Laravel
Write-Host "[2/3] Menjalankan Backend Laravel (port 8000)..." -ForegroundColor Yellow
$laravel = Get-Process -Name "php" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*artisan serve*" }
if ($laravel) {
    Write-Host "      Backend sudah jalan di http://localhost:8000" -ForegroundColor Green
} else {
    Start-Process -NoNewWindow -FilePath "C:\xampp\php\php.exe" -WorkingDirectory "D:\oktow\appdev\digicare\backend-php" -ArgumentList "artisan serve"
    Write-Host "      Backend dijalankan di http://localhost:8000" -ForegroundColor Green
}

# 3. Frontend Vite
Write-Host "[3/3] Menjalankan Frontend React (port 5173)..." -ForegroundColor Yellow
$vite = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" }
if ($vite) {
    Write-Host "      Frontend sudah jalan di http://localhost:5173" -ForegroundColor Green
} else {
    Start-Process -NoNewWindow -FilePath "C:\Program Files\nodejs\npm.cmd" -WorkingDirectory "D:\oktow\appdev\digicare\frontend" -ArgumentList "run dev"
    Write-Host "      Frontend dijalankan di http://localhost:5173" -ForegroundColor Green
}

Write-Host "`n=== Selesai! ===" -ForegroundColor Cyan
Write-Host "Buka browser: http://localhost:5173" -ForegroundColor White
Write-Host "Login: admin / admin123" -ForegroundColor White
