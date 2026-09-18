$ErrorActionPreference = "Stop"
$ip = "145.223.116.231"
$key = "$env:USERPROFILE\.ssh\destan_vps"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh" | Out-Null
if (!(Test-Path $key)) {
  cmd /c "ssh-keygen -t ed25519 -f "$key" -N "" -C destan-taner"
}
$config = "$env:USERPROFILE\.ssh\config"
$block = @"
Host destan-vps
  HostName $ip
  User root
  IdentityFile $key
  IdentitiesOnly yes
"@
if (!(Test-Path $config) -or -not (Select-String -Path $config -Pattern "Host destan-vps" -Quiet)) {
  Add-Content -Path $config -Value "`r`n$block"
}
Write-Host "PUBLIC KEY (VPS'e eklenecek):"
Get-Content "$key.pub"
Write-Host ""
Write-Host "VPS terminaline yapistir:"
$pub = (Get-Content "$key.pub" -Raw).Trim()
Write-Host "mkdir -p /root/.ssh && chmod 700 /root/.ssh && echo '$pub' >> /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys"
