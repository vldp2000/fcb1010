param(
  [string]$DistRepoPath = "D:\V\Projects\fcb-maintenance-ui-dist",
  [string]$RemoteUrl = "https://github.com/vldp2000/fcb-maintenance-ui-dist.git",
  [switch]$AllowDirty,
  [switch]$Push
)

$ErrorActionPreference = "Stop"

$sourceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$maintenanceRoot = Resolve-Path $PSScriptRoot
$distPath = Join-Path $maintenanceRoot "dist"

$sourceChanges = git -C $sourceRoot status --porcelain
if ($sourceChanges -and !$AllowDirty) {
  throw "Source tree has uncommitted changes. Commit them first, or rerun with -AllowDirty."
}

Write-Host "Building maintenance UI..."
Push-Location $maintenanceRoot
try {
  $env:NODE_OPTIONS = "--openssl-legacy-provider"
  npm run build
} finally {
  Pop-Location
}

if (!(Test-Path $distPath)) {
  throw "Build did not create $distPath"
}

$resolvedProjectsRoot = Resolve-Path "D:\V\Projects"
$distRepoParent = Split-Path -Parent $DistRepoPath
if ((Resolve-Path $distRepoParent).Path -ne $resolvedProjectsRoot.Path) {
  throw "DistRepoPath must be directly under D:\V\Projects"
}

if (!(Test-Path $DistRepoPath)) {
  New-Item -ItemType Directory -Path $DistRepoPath | Out-Null
}

Push-Location $DistRepoPath
try {
  if (!(Test-Path ".git")) {
    git init
    git remote add origin $RemoteUrl
  }

  $remote = git remote get-url origin 2>$null
  if (!$remote) {
    git remote add origin $RemoteUrl
  }

  Get-ChildItem -Force |
    Where-Object { $_.Name -ne ".git" } |
    Remove-Item -Recurse -Force

  Copy-Item -Path (Join-Path $distPath "*") -Destination $DistRepoPath -Recurse -Force

  $sourceBranch = git -C $sourceRoot rev-parse --abbrev-ref HEAD
  $sourceCommit = git -C $sourceRoot rev-parse HEAD
  $sourceShortCommit = git -C $sourceRoot rev-parse --short HEAD
  $sourceDirty = [bool](git -C $sourceRoot status --porcelain)
  $builtAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

  $version = [ordered]@{
    sourceRepository = "fcb1010"
    sourceBranch = $sourceBranch
    sourceCommit = $sourceCommit
    sourceDirty = $sourceDirty
    builtAtUtc = $builtAt
  }
  $version | ConvertTo-Json | Set-Content -Path "version.json" -Encoding UTF8

  git add .
  $changes = git status --porcelain
  if ($changes) {
    git commit -m "Release UI $builtAt ($sourceShortCommit)"
  } else {
    Write-Host "No UI dist changes to commit."
  }

  if ($Push) {
    git push -u origin HEAD:main
  } else {
    Write-Host "Local dist repo is ready at $DistRepoPath"
    Write-Host "Create $RemoteUrl on GitHub, then run: .\maintenance\release-ui.ps1 -Push"
  }
} finally {
  Pop-Location
}
