Get-ChildItem -Path d:\calculator\app\components\calculators -Filter *.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match '<Calculator' -and $content -notmatch 'import \{[^}]*Calculator[^}]*\} from ''lucide-react''') {
        Write-Host "Fixing missing Calculator import in: $($_.FullName)"
        
        # Check if lucide-react is imported at all
        if ($content -match 'import \{([^}]*)\} from ''lucide-react''') {
            # Add Calculator to existing lucide-react import
            $newContent = $content -replace 'import \{([^}]*)\} from ''lucide-react''', 'import { $1, Calculator } from ''lucide-react'''
            # Cleanup any double commas or spaces
            $newContent = $newContent -replace ', ,', ','
            $newContent = $newContent -replace '\{ ,', '{'
        } else {
            # Add new lucide-react import after 'use client' or React import
            $newContent = $content -replace "import React", "import { Calculator } from 'lucide-react';`nimport React"
        }
        
        if ($content -ne $newContent) {
            Set-Content $_.FullName $newContent
        }
    }
}
