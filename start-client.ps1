# PowerShell script to start the client
Write-Host "🎨 Starting Australian Services Client..." -ForegroundColor Green

# Navigate to client directory
Set-Location -Path "client"

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "🔥 Starting client on http://localhost:5173" -ForegroundColor Green
npm run dev 