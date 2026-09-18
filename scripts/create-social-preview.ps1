#Requires -Version 7.0
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$canvas = New-Object System.Drawing.Bitmap 1200,630
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
function Fill-Box($hex, $x, $y, $width, $height) {
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
    $graphics.FillRectangle($brush, $x, $y, $width, $height)
    $brush.Dispose()
}
function Draw-Label($text, $size, $hex, $x, $y, $bold = $false) {
    $style = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $font = New-Object System.Drawing.Font 'Malgun Gothic', $size, $style, ([System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
    $graphics.DrawString($text, $font, $brush, $x, $y)
    $font.Dispose()
    $brush.Dispose()
}
try {
    Fill-Box '#faf9f4' 0 0 1200 630
    Fill-Box '#19334e' 0 0 650 630
    Draw-Label '피드백 한 스푼, 성장 두 스푼' 23 '#96ded4' 54 93
    Draw-Label 'Feed' 112 '#ffffff' 48 165 $true
    Draw-Label 'ON' 112 '#e4fa59' 309 165 $true
    Draw-Label '학생 주도성을 켜는' 35 '#ffffff' 54 332 $true
    Draw-Label '퍼스널 피드백 도우미' 35 '#ffffff' 54 391 $true
    Draw-Label '학생의 관찰에서 다음 성장까지' 23 '#cad9e4' 54 508
    Fill-Box '#daf1eb' 702 114 184 46
    Draw-Label 'FEEDBACK ON' 20 '#23685a' 720 123 $true
    Fill-Box '#19334e' 702 206 442 94
    Draw-Label '피드백 만들기' 34 '#ffffff' 727 229 $true
    Draw-Label '→' 35 '#e4fa59' 1075 226 $true
    Draw-Label '학생의 실제 수행을 바탕으로' 25 '#40566a' 702 346
    Draw-Label '바로 활용하는 Teacher Talk' 25 '#40566a' 702 387
    Draw-Label '관찰  →  피드백  →  다음 행동' 22 '#40566a' 702 462
    Draw-Label '© 경인초 학생평가 연구팀' 20 '#627584' 702 554
    $target = Join-Path $PSScriptRoot '../public/feedon-preview-20260918.png'
    $canvas.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $graphics.Dispose()
    $canvas.Dispose()
}
