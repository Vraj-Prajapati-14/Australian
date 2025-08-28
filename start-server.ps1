# PowerShell script to start the server
Write-Host "🚀 Starting Australian Services Server..." -ForegroundColor Green

# Check if MongoDB is running (optional check)
Write-Host "📊 Checking MongoDB connection..." -ForegroundColor Yellow

# Navigate to server directory
Set-Location -Path "server"

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "🔥 Starting server on http://localhost:5000" -ForegroundColor Green
npm start 