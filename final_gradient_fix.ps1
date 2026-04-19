Get-ChildItem -Path d:\calculator\app -Filter *.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'bg-gradient-to-r') {
        Write-Host "Gradient found in: $($_.FullName)"
        
        # Aggressively replace any leftover gradient headers
        $newContent = $content -replace '<div className="bg-gradient-to-r from-[\w-]+-600 to-[\w-]+-600 px-6 py-4">[\s\S]*?<\/div>', '<div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div></div>'
        $newContent = $newContent -replace '<div className="bg-gradient-to-r from-[\w-]+-500 to-[\w-]+-500 px-6 py-4">[\s\S]*?<\/div>', '<div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div></div>'

        if ($content -ne $newContent) {
            Set-Content $_.FullName $newContent
            Write-Host "Fixed gradient header in $($_.FullName)"
        }
    }
}
