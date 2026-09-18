param([Parameter(Mandatory=$true)][string]$LocalPath, [string]$RemotePath = "/home/destanonline.com/apps/ed5")
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $LocalPath | Out-Null
$src = "destan-vps:$RemotePath/"
Write-Host "INDIR $src -> $LocalPath"
scp -r "$src*" $LocalPath
Write-Host "bitti"
