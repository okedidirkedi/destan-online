param([Parameter(Mandatory=$true)][string]$LocalPath, [string]$RemotePath = "/home/destanonline.com/apps/ed5")
$ErrorActionPreference = "Stop"
if (!(Test-Path $LocalPath)) { throw "Yerel yol yok: $LocalPath" }
$dest = "destan-vps:$RemotePath/"
Write-Host "YUKLE $LocalPath -> $dest"
scp -r "$LocalPath\*" $dest
Write-Host "bitti"
