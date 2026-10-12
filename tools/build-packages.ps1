# ============================================================
#  HSK 1 - build the two deployment packages (Windows PowerShell)
#  ASCII-only on purpose (see push-github.ps1 header note).
#
#  Usage:
#    powershell -ExecutionPolicy Bypass -File tools\build-packages.ps1
#  Outputs (one level above the course folder, like the old flow):
#    ..\hsk1-github.zip    online bundle  (gate + tracking)
#    ..\hsk1-offline.zip   offline bundle (gate & tracking disabled)
#  Both archives have index.html at the root (Netlify-drop ready).
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Copy-Bundle($dst) {
  Remove-Item $dst -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Path $dst | Out-Null
  Copy-Item index.html, lesson.html, gate.html, teacher.html, _headers -Destination $dst -ErrorAction SilentlyContinue
  Copy-Item css, js, audio -Recurse -Destination $dst
  Remove-Item (Join-Path $dst 'js\data\_TEMPLATE.js') -Force -ErrorAction SilentlyContinue
}

Write-Host '-> building dist-online ...'
Copy-Bundle 'dist-online'

Write-Host '-> building dist-offline (gate off) ...'
Copy-Bundle 'dist-offline'
$cfgPath = Join-Path 'dist-offline' 'js\config.js'
$cfg = Get-Content $cfgPath -Raw
$cfg = $cfg -replace "sheetsUrl:\s*'[^']*'", "sheetsUrl: ''"
$cfg = $cfg -replace 'enabled:\s*true', 'enabled: false'
Set-Content $cfgPath $cfg -Encoding UTF8

Write-Host '-> zipping ...'
Remove-Item ..\hsk1-github.zip, ..\hsk1-offline.zip -Force -ErrorAction SilentlyContinue
Compress-Archive -Path (Join-Path 'dist-online'  '*') -DestinationPath ..\hsk1-github.zip
Compress-Archive -Path (Join-Path 'dist-offline' '*') -DestinationPath ..\hsk1-offline.zip

Get-Item ..\hsk1-github.zip, ..\hsk1-offline.zip |
  Select-Object Name, @{ n = 'MB'; e = { [math]::Round($_.Length / 1MB, 1) } }
Write-Host '[OK] Done - index.html sits at the root of both archives.'
