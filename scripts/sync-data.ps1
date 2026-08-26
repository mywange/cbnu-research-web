# ==========================================================================
# CBNU Research Group - Zero-Dependency Data Synchronizer & Parser
# Parses Markdown (.md) frontmatter and JSON files into unified database files
# ==========================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CBNU Research Group Data Synchronizer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $rootDir "data"))) {
    $rootDir = $PSScriptRoot
}
$dataDir = Join-Path $rootDir "data"

function Parse-FrontmatterMarkdown {
    param ([string]$filePath)
    
    $rawText = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $metadata = [ordered]@{}
    $body = ""

    if ($rawText -match "(?s)^\s*---\r?\n(.*?)\r?\n---\r?\n?(.*)$") {
        $yamlText = $matches[1]
        $body = $matches[2].Trim()

        $lines = $yamlText -split "\r?\n"
        foreach ($line in $lines) {
            if ($line -match "^\s*([a-zA-Z0-9_-]+)\s*:\s*(.*)$") {
                $key = $matches[1].Trim()
                $val = $matches[2].Trim()

                # Remove wrapping quotes
                if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
                    $val = $val.Substring(1, $val.Length - 2)
                }

                if ($val -eq "true") { $val = $true }
                elseif ($val -eq "false") { $val = $false }
                elseif ($val -match "^\d+$" -and $key -eq "id") { $val = [int]$val }

                $metadata[$key] = $val
            }
        }
    } else {
        $body = $rawText.Trim()
    }

    if (-not $metadata.Contains("content")) {
        $metadata["content"] = $body
    }
    if (-not $metadata.Contains("summary") -and $body) {
        $metadata["summary"] = $body
    }

    return $metadata
}

function Sync-FolderToDataJson {
    param (
        [string]$folderName,
        [string]$outputJsonName,
        [string]$typeName
    )

    $folderPath = Join-Path $dataDir $folderName
    $outputPath = Join-Path $dataDir $outputJsonName
    $items = @()

    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -File | Where-Object { 
            ($_.Extension -eq ".md" -or $_.Extension -eq ".json") -and 
            -not $_.Name.StartsWith("_") -and 
            $_.Name -ne "sample.md" 
        } | Sort-Object Name -Descending

        $autoId = 1
        foreach ($file in $files) {
            try {
                if ($file.Extension -eq ".json") {
                    $jsonContent = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
                    $data = $jsonContent | ConvertFrom-Json
                    if ($null -eq $data.id) { $data | Add-Member -MemberType NoteProperty -Name "id" -Value $autoId }
                    $items += $data
                } elseif ($file.Extension -eq ".md") {
                    $parsed = Parse-FrontmatterMarkdown -filePath $file.FullName
                    if (-not $parsed.Contains("id") -or -not $parsed["id"]) {
                        $parsed["id"] = $autoId
                    }
                    $items += [PSCustomObject]$parsed
                }
                $autoId++
            } catch {
                Write-Host "[WARN] Failed to parse $($file.Name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }

    # Sort items by date descending, then id descending
    $sortedList = [System.Collections.Generic.List[PSCustomObject]]::new()
    foreach ($it in $items) {
        $sortedList.Add($it)
    }

    $finalItems = @($sortedList | Sort-Object -Property @{Expression = { if ($_.date) { $_.date } else { "" } }; Descending = $true }, @{Expression = { if ($_.id) { [int]$_.id } else { 0 } }; Descending = $true })

    $count = $finalItems.Count
    $jsonString = ConvertTo-Json -InputObject $finalItems -Depth 10
    [System.IO.File]::WriteAllText($outputPath, $jsonString, [System.Text.Encoding]::UTF8)
    Write-Host "[OK] $outputJsonName updated successfully ($count $typeName items)." -ForegroundColor Green
}

# 1. Sync News
Sync-FolderToDataJson -folderName "news" -outputJsonName "news-data.json" -typeName "News"

# 2. Sync Events
Sync-FolderToDataJson -folderName "events" -outputJsonName "events-data.json" -typeName "Events"

# 3. Sync Gallery
Sync-FolderToDataJson -folderName "gallery" -outputJsonName "gallery-data.json" -typeName "Gallery"

# 4. Sync Publications
$pubDataPath = Join-Path $dataDir "publications-data.json"
$pubAliasPath = Join-Path $dataDir "publications.json"

if (Test-Path $pubDataPath) {
    try {
        $pubs = Get-Content -Path $pubDataPath -Raw -Encoding UTF8 | ConvertFrom-Json
        Copy-Item -Path $pubDataPath -Destination $pubAliasPath -Force
        Write-Host "[OK] publications-data.json & publications.json synchronized ($($pubs.Count) publications)." -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Invalid publications-data.json: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All datasets processed and ready!" -ForegroundColor Cyan
