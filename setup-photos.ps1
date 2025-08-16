# PowerShell script to setup Instagram photos for GusMack1 reviews
Write-Host "🚀 Setting up Instagram photos for GusMack1 reviews..." -ForegroundColor Green

# Create directories
Write-Host "Creating photo directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "public\images\restaurants"
New-Item -ItemType Directory -Force -Path "public\images\dishes"

# Copy Mahony's photo
Write-Host "Copying Mahony's Steakhouse photos..." -ForegroundColor Yellow
$mahonysSource = "instagram-gusmack1-2025-08-15-WIAqpO3X\your_instagram_activity\media\other\367671275_3440387326225548_7205436968547403869_n_17975674130294912.heic"
$mahonysDest = "public\images\restaurants\mahonys-steakhouse-bishopbriggs-1.jpg"

if (Test-Path $mahonysSource) {
    Copy-Item $mahonysSource $mahonysDest
    Write-Host "✅ Copied Mahony's photo" -ForegroundColor Green
} else {
    Write-Host "⚠️  Mahony's photo not found at: $mahonysSource" -ForegroundColor Yellow
}

# Copy Domino's photos
Write-Host "Copying Domino's Pizza photos..." -ForegroundColor Yellow
$dominosSources = @(
    "instagram-gusmack1-2025-08-15-WIAqpO3X\your_instagram_activity\media\other\367671275_3440387326225548_7205436968547403869_n_17975674130294912.heic",
    "instagram-gusmack1-2025-08-15-WIAqpO3X\your_instagram_activity\media\posts\202307\361734839_1750369278710901_6925415132522764133_n_17985439460192856.heic",
    "instagram-gusmack1-2025-08-15-WIAqpO3X\your_instagram_activity\media\posts\202307\361799762_1022252015621214_8064318593596838578_n_18229909489170529.heic"
)

for ($i = 0; $i -lt $dominosSources.Count; $i++) {
    $source = $dominosSources[$i]
    $dest = "public\images\restaurants\dominos-pizza-glasgow-$($i+1).jpg"
    
    if (Test-Path $source) {
        Copy-Item $source $dest
        Write-Host "✅ Copied Domino's photo $($i+1)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Domino's photo $($i+1) not found at: $source" -ForegroundColor Yellow
    }
}

# Run the Node.js setup script
Write-Host "Running Node.js photo setup..." -ForegroundColor Yellow
node scripts/setup-instagram-photos.js

Write-Host "✅ Photo setup complete!" -ForegroundColor Green
Write-Host "You can now run: npm run build" -ForegroundColor Cyan
