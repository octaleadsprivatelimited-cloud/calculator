Get-ChildItem -Path d:\calculator\app\components\calculators -Filter *.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Target the specific broken header pattern
    # It usually starts with <div className="bg-gradient-to-r ...">
    # and has a nested <div className="flex items-center">
    # We want to replace everything from that first div until the closing tag of the header
    
    $newContent = $content -replace '<div className="bg-gradient-to-r[^>]*">\s*<div className="flex items-center">[\s\S]*?<\/div>\s*<\/div>', '<div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div></div>'
    
    # Also catch cases where there's an extra text line after the flex-div
    $newContent = $newContent -replace '<div className="bg-gradient-to-r[^>]*">\s*<div className="flex items-center">[\s\S]*?<\/div>\s*<p[\s\S]*?<\/p>\s*<\/div>', '<div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div></div>'

    # Finally, if any bg-gradient-to-r still exists, just kill the line
    # But that's dangerous. Let's just do one more pass for single-line gradients.
    $newContent = $newContent -replace '<div className="bg-gradient-to-r[^>]*">', '<div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div>'

    if ($content -ne $newContent) {
        Set-Content $_.FullName $newContent
        Write-Host "Corrected header in $($_.FullName)"
    }
}
