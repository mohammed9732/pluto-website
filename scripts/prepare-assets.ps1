# SUPERSEDED by rebuild-frames.py: the zips hold heavily compressed ezgif exports that look
# blurry on screen. Kept only as a fallback if the original videos are unavailable; the site
# now expects .webp frames, so switch `ext` back to 'jpg' in src/lib/sequences.ts if you use it.
#
# Rebuilds public/sequence-1, public/sequence-2 and public/globe-loop.mp4 from the
# source zips that live one folder up. Copy-only: the originals are never touched.
# The two Sequence-1 zips reuse the same filenames, so they are renumbered into one run.
$ErrorActionPreference = 'Stop'
$app = Split-Path $PSScriptRoot -Parent
$src = Split-Path $app -Parent
$pub = Join-Path $app 'public'
$tmp = Join-Path $env:TEMP 'pluto-frames'

function Expand-Seq($zip, $dest) {
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
  Expand-Archive -Path $zip -DestinationPath $dest
  Get-ChildItem $dest -Recurse -Filter *.jpg | Sort-Object Name
}

function Write-Seq($files, $outDir, $startAt) {
  New-Item -ItemType Directory -Force $outDir | Out-Null
  $i = $startAt
  foreach ($f in $files) {
    Copy-Item $f.FullName (Join-Path $outDir ('frame-{0:D4}.jpg' -f $i)) -Force
    $i++
  }
  return $i
}

$next = Write-Seq (Expand-Seq "$src\sequence 1.zip" "$tmp\s1") "$pub\sequence-1" 1
$null = Write-Seq (Expand-Seq "$src\sequence 1 continured.zip" "$tmp\s1c") "$pub\sequence-1" $next
$null = Write-Seq (Expand-Seq "$src\sequence 2.zip" "$tmp\s2") "$pub\sequence-2" 1
Copy-Item "$src\pluto loop.mp4" "$pub\globe-loop.mp4" -Force

"sequence-1: $((Get-ChildItem "$pub\sequence-1").Count) frames (expect 181)"
"sequence-2: $((Get-ChildItem "$pub\sequence-2").Count) frames (expect 150)"
