# ==========================================================================
# CBNU Research Group - Zero-Dependency Local Static Server (PowerShell)
# ==========================================================================

$port = 8080
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "index.html"))) {
    $root = $PSScriptRoot
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

$ip = [System.Net.IPAddress]::Loopback
$listener = $null
$boundPort = $port

for ($p = $port; $p -le ($port + 10); $p++) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new($ip, $p)
        $listener.Start()
        $boundPort = $p
        break
    } catch {
        $listener = $null
    }
}

if ($null -eq $listener) {
    Write-Host "[ERROR] Could not bind to port $port - $($port + 10)" -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$boundPort/"
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  CBNU Research Group Local Web Server is Running!" -ForegroundColor Green
Write-Host "  URL: $url" -ForegroundColor Yellow
Write-Host "  Root Directory: $root" -ForegroundColor Gray
Write-Host "  Press Ctrl + C to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

try {
    Start-Process $url -ErrorAction SilentlyContinue
} catch {}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)

        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($requestLine)) {
            $client.Close()
            continue
        }

        while (($h = $reader.ReadLine()) -ne $null -and $h.Length -gt 0) {}

        $parts = $requestLine.Split(' ')
        $rawPath = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
        
        $cleanPath = $rawPath.Split('?')[0].TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($cleanPath)) {
            $cleanPath = "index.html"
        }

        $cleanPath = [System.Uri]::UnescapeDataString($cleanPath)
        $filePath = [System.IO.Path]::Combine($root, $cleanPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $headerText = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)

            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
        } else {
            $errBody = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $headerText = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($errBody.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)

            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($errBody, 0, $errBody.Length)
        }

        $stream.Flush()
        $client.Close()
    } catch {
        # continue loop
    }
}
