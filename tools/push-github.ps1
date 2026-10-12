# ============================================================
#  HSK 1 - one-command GitHub publish (Windows PowerShell)
#  ASCII-only on purpose (Windows PowerShell 5.1 reads scripts
#  without UTF-8 BOM; fancy dashes would break the parser).
#
#  What it does:
#    1) builds dist-online/ automatically if missing (repo root)
#    2) if Git is installed  -> init -> commit -> push
#       if Git is NOT installed -> still builds dist-online and
#       prints the GitHub-Desktop clicks to publish it
#
#  Usage (inside the course folder):
#    powershell -ExecutionPolicy Bypass -File tools\push-github.ps1
#  (it asks your GitHub username; the empty repo named hsk1 must
#   already exist on github.com)
# ============================================================
param(
  [string]$User,
  [string]$Repo = 'hsk1'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (-not $User) { $User = Read-Host 'Your GitHub username' }
if (-not $PSBoundParameters['Repo']) {
  $r2 = Read-Host 'Repository name on GitHub (press Enter for hsk1)'
  if ($r2) { $Repo = $r2 }
}

# build dist-online if missing
if (-not (Test-Path 'dist-online\index.html')) {
  Write-Host '-> building dist-online ...' -ForegroundColor Cyan
  New-Item -ItemType Directory -Path 'dist-online' -Force | Out-Null
  Copy-Item index.html, lesson.html, gate.html, teacher.html, _headers -Destination 'dist-online' -ErrorAction SilentlyContinue
  Copy-Item css, js, audio -Recurse -Destination 'dist-online'
  Remove-Item 'dist-online\js\data\_TEMPLATE.js' -Force -ErrorAction SilentlyContinue
}

# mirror project memory & tools into the repo (private repo = safe backup)
Copy-Item tools (Join-Path 'dist-online' 'tools') -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item google-sheets (Join-Path 'dist-online' 'google-sheets') -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item README.md, DEPLOY_AR.md -Destination 'dist-online' -Force -ErrorAction SilentlyContinue
if (Test-Path RESUME_AR.md) { Copy-Item RESUME_AR.md -Destination 'dist-online' -Force }
if (Test-Path PROTECTION_AR.md) { Copy-Item PROTECTION_AR.md -Destination 'dist-online' -Force }
if (Test-Path PLAYBOOK_AR.md) { Copy-Item PLAYBOOK_AR.md -Destination 'dist-online' -Force }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host ''
  Write-Host 'Git not found - dist-online is READY. Publish with GitHub Desktop:' -ForegroundColor Yellow
  Write-Host '  1) GitHub Desktop -> File -> Add Local Repository -> choose:'
  Write-Host ('     ' + (Join-Path $root 'dist-online'))
  Write-Host ("  2) Publish repository -> name: $Repo")
  exit 0
}

Set-Location dist-online
git init | Out-Null
git add -A
git commit -m "HSK Standard Course 1 - interactive course + integrity layer v2.1 (gate, device tracking, per-lesson analytics)" | Out-Null
git branch -M main
# note: plain `git remote` prints nothing to stderr when empty (safe under PS 5.1 Stop)
if ((git remote) -contains 'origin') { git remote set-url origin "https://github.com/$User/$Repo.git" }
else { git remote add origin "https://github.com/$User/$Repo.git" }
# note: capture via cmd so git's stderr progress lines cannot trip PS Stop mode
$pushOut = cmd /c "git push -u origin main 2>&1"
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host '[FAILED] push did not complete:' -ForegroundColor Red
  Write-Host $pushOut
  Write-Host 'Checks: the repo exists on github.com under this exact name, is EMPTY,' -ForegroundColor Yellow
  Write-Host 'and you are signed in as the same user. Then re-run this script.' -ForegroundColor Yellow
  exit 1
}

Write-Host ''
Write-Host "[OK] Pushed: https://github.com/$User/$Repo" -ForegroundColor Green
Write-Host '  Pages : repo Settings -> Pages -> Deploy from a branch -> main / (root) -> Save'
Write-Host '  Note  : GitHub Pages needs a PUBLIC repo on the free plan (or Pro for private).'
Write-Host '  Site  : https://<user>.github.io/<repo>/  (all links are relative, subpath-safe)'
