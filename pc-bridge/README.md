# Destan PC ↔ VPS köprüsü

Taner Windows → Hostinger VPS (`root@145.223.116.231`)
Uzak kök: `/home/destanonline.com/apps/ed5`

## Bir kez
PowerShell (Yönetici gerekmez):

```powershell
cd $env:USERPROFILE
if (!(Test-Path destan-online)) { git clone https://github.com/okedidirkedi/destan-online.git }
cd destan-online\pc-bridge
Set-ExecutionPolicy -Scope Process Bypass
.\setup-ssh.ps1
```

Public key ekrana gelir. VPS terminaline `setup-ssh.ps1`'in verdiği tek satırı yapıştır.

## Her gün

Yükle (PC → VPS):
```powershell
.\up.ps1 T:\ED5\4-krallık
```

İndir (VPS → PC):
```powershell
.\down.ps1 T:\ED5\4-krallık
```

Bağlan:
```powershell
ssh root@145.223.116.231
```
