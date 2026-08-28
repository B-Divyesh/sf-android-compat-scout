$ErrorActionPreference = 'Stop'
$repo = 'B-Divyesh/sf-android-compat-scout'
$asset = 'compat-scout-x86_64-pc-windows-msvc.zip'
$base = "https://github.com/$repo/releases/latest/download"
$tmp = Join-Path $env:TEMP "compat-scout-$PID"
New-Item -ItemType Directory -Path $tmp | Out-Null
Invoke-WebRequest "$base/SHA256SUMS" -OutFile "$tmp\SHA256SUMS"
Invoke-WebRequest "$base/$asset" -OutFile "$tmp\$asset"
$expected = ((Get-Content "$tmp\SHA256SUMS") | Where-Object { $_ -match [regex]::Escape($asset) }).Split(' ')[0]
if ((Get-FileHash "$tmp\$asset" -Algorithm SHA256).Hash.ToLower() -ne $expected.ToLower()) { throw 'Checksum did not match.' }
$target = Join-Path $env:LOCALAPPDATA 'CompatScout\bin'; New-Item -ItemType Directory -Force -Path $target | Out-Null
Expand-Archive "$tmp\$asset" -DestinationPath $target -Force
Write-Host "Installed compat-scout in $target. Add it to PATH if needed."
