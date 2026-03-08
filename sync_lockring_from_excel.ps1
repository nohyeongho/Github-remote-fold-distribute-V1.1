param(
  [string]$ExcelPath = "d:\Github-remote-fold-distribute-V1.1\lockring.xlsx",
  [string]$HtmlPath = "d:\Github-remote-fold-distribute-V1.1\lockring-search.html",
  [switch]$DryRun
)

if (!(Test-Path $ExcelPath)) { Write-Host "Error: Excel file not found: $ExcelPath"; exit 1 }
if (!(Test-Path $HtmlPath)) { Write-Host "Error: HTML file not found: $HtmlPath"; exit 1 }

Write-Host "Opening Excel: $ExcelPath"
$excel = New-Object -ComObject Excel.Application -ErrorAction SilentlyContinue
if (-not $excel) {
  Write-Host "Error: Could not create Excel COM object. Ensure Microsoft Excel is installed."; exit 1
}
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open($ExcelPath)
$sheet = $wb.Worksheets.Item(1)
$used = $sheet.UsedRange
$rows = $used.Rows.Count
$cols = $used.Columns.Count

# Read headers
$headers = @()
for ($c = 1; $c -le $cols; $c++) {
  $val = $used.Cells.Item(1,$c).Text
  $headers += ([string]$val)
}

function NormalizeKey($s) {
  if ($null -eq $s) { return "" }
  $s = $s.ToLower() -replace "[^a-z0-9]", ""
  return $s
}

# detect columns
$groupIdx = $null; $whereIdx = $null; $partIdx = $null; $connectorIdx = $null; $usageIdx = $null; $pipeIdx = $null
for ($i=0;$i -lt $headers.Count;$i++) {
  $h = NormalizeKey($headers[$i])
  if ($null -eq $groupIdx -and ($h -match "group|no|index|category|key")) { $groupIdx = $i }
  if ($null -eq $whereIdx -and ($h -match "wheretouse|where|usage|usagetype")) { $whereIdx = $i }
  if ($null -eq $partIdx -and ($h -match "partnumber|part_num|partnum|part")) { $partIdx = $i }
  if ($null -eq $connectorIdx -and ($h -match "connectorname|connector|connect")) { $connectorIdx = $i }
  if ($null -eq $usageIdx -and ($h -match "usagearea|usearea|usage")) { $usageIdx = $i }
  if ($null -eq $pipeIdx -and ($h -match "pipesize|pipe_size|pipe|size")) { $pipeIdx = $i }
}
if ($groupIdx -eq $null) { $groupIdx = 0 }

$result = @{}

for ($r = 2; $r -le $rows; $r++) {
  $cells = @()
  for ($c = 1; $c -le $cols; $c++) { $cells += [string]$used.Cells.Item($r,$c).Text }
  $keyRaw = $cells[$groupIdx]
  if ([string]::IsNullOrWhiteSpace($keyRaw)) { continue }
  $key = $keyRaw.Trim()
  $item = @{}
  function GetVal($idx, $arr) {
    if ($null -ne $idx -and $idx -lt $arr.Count) { return $arr[$idx].Trim() }
    return ""
  }

  $item['whereToUse'] = GetVal $whereIdx $cells
  $item['partNumber'] = GetVal $partIdx $cells
  $item['connectorName'] = GetVal $connectorIdx $cells
  $item['usageArea'] = GetVal $usageIdx $cells
  $item['pipeSize'] = GetVal $pipeIdx $cells

  if (-not $result.ContainsKey($key)) { $result[$key] = @() }
  $result[$key] += $item
}

# cleanup
$wb.Close($false)
$excel.Quit()
[void][System.Runtime.Interopservices.Marshal]::ReleaseComObject($sheet)
[void][System.Runtime.Interopservices.Marshal]::ReleaseComObject($wb)
[void][System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel)

# Convert to JSON with depth
# Normalize some common Excel auto-conversion issues before JSON:
# If pipeSize is a large integer (Excel date serial), convert to M/D string (e.g. 46236 -> "8/2").
foreach ($k in $result.Keys) {
  $arr = $result[$k]
  for ($i = 0; $i -lt $arr.Count; $i++) {
    $psVal = $arr[$i]['pipeSize']
    if ($null -ne $psVal -and $psVal -match '^[0-9]+$') {
      try {
        $num = [double]$psVal
        if ($num -gt 20000) {
          # likely an OLE Automation date serial -> convert to Month/Day
          $dt = [DateTime]::FromOADate($num)
          $arr[$i]['pipeSize'] = "{0}/{1}" -f $dt.Month, $dt.Day
        }
      } catch {
        # ignore conversion errors
      }
    }
    # also handle pipeSize values like '8/2' stored as text '8/2' — keep as-is
  }
}

$json = $result | ConvertTo-Json -Depth 5 -Compress
# ConvertTo-Json emits escaped unicode; keep it as-is

$newJs = "const excelData = " + $json + ";"

Write-Host "Generated excelData for $($result.Keys.Count) groups."

if ($DryRun) {
  Write-Host "Dry run output (truncated 1000 chars):"
  $newJs.Substring(0, [Math]::Min(1000, $newJs.Length)) | Write-Host
  exit 0
}

# Replace existing block
$content = Get-Content -Raw -Encoding UTF8 $HtmlPath
$pattern = '(?s)const\s+excelData\s*=\s*\{.*?\n\s*\};'
if ($content -match $pattern) {
  $newContent = [regex]::Replace($content, $pattern, $newJs)
} else {
  Write-Host "Warning: const excelData block not found, appending before </script> or at file end"
  $idx = $content.LastIndexOf('</script>')
  if ($idx -ge 0) { $newContent = $content.Substring(0,$idx) + "`n" + $newJs + "`n" + $content.Substring($idx) }
  else { $newContent = $content + "`n" + $newJs }
}

Set-Content -Path $HtmlPath -Value $newContent -Encoding UTF8
Write-Host "HTML updated successfully: $HtmlPath"
