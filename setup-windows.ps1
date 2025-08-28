# PowerShell script to set up the Australian Services project on Windows
Write-Host "🔧 Setting up Australian Services Project..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

# Install server dependencies
Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path "server"
npm install

# Install client dependencies
Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path "..\client"
npm install

# Return to root directory
Set-Location -Path ".."

# Create .env file if it doesn't exist
$envPath = "server\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    $envContent = @"
# Database
MONGO_URI=mongodb://localhost:27017/australian_services

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Admin credentials
ADMIN_EMAIL=admin@australian.com
ADMIN_PASSWORD=admin123

# Environment
NODE_ENV=development

# Frontend URLs
FRONTEND_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175
"@
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Set up admin user
Write-Host "👤 Setting up admin user..." -ForegroundColor Yellow
node setup-admin.js

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB (if not already running)" -ForegroundColor White
Write-Host "2. Run: .\start-server.ps1" -ForegroundColor White
Write-Host "3. Run: .\start-client.ps1 (in a new terminal)" -ForegroundColor White
Write-Host "4. Login at: http://localhost:5173/admin/login" -ForegroundColor White
Write-Host "   Email: admin@australian.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White 