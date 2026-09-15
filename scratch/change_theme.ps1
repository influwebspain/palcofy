$content = Get-Content -Path 'app\app.css' -Raw
$content = $content -replace 'rgba\(255,255,255,', 'rgba(0,0,0,'
$content = $content -replace 'color:\s*white;', 'color: var(--app-dark);'
$content = $content -replace '--app-bg: #0F0A1A;', '--app-bg: #F4F5F7;'
$content = $content -replace '--app-surface: #1A1230;', '--app-surface: #FFFFFF;'
$content = $content -replace '--app-surface-2: #231A3A;', '--app-surface-2: #F9FAFB;'
$content = $content -replace '--app-border: rgba\(0,0,0,0.06\);', '--app-border: rgba(0,0,0,0.08);'
$content = $content -replace '--app-text: rgba\(0,0,0,0.85\);', '--app-text: #1F2937;'
$content = $content -replace '--app-text-muted: rgba\(0,0,0,0.45\);', '--app-text-muted: #6B7280;'
$content = $content -replace '--app-radius: 12px;', "--app-radius: 12px;
  --app-dark: #111827;"
$content = $content -replace 'box-shadow: 0 0 40px rgba\(0,0,0,0.8\);', 'box-shadow: 0 0 40px rgba(0,0,0,0.15);'
Set-Content -Path 'app\app.css' -Value $content
