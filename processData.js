const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFilePath = path.join(__dirname, 'simrinar-checker', 'src', 'data.json');

// Simple CSV parser
function parseCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        // Handle basic CSV splitting, ignoring commas inside quotes
        let line = lines[i].trim();
        if (!line) continue;
        
        let row = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        row.push(currentValue.trim());
        
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        rows.push(obj);
    }
    return rows;
}

function processFiles() {
    const result = {};
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
    
    files.forEach(file => {
        const matanName = file.replace('.csv', '');
        const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const data = parseCSV(content);
        
        // Find Mualim for each group
        const mualims = {};
        data.forEach(row => {
            if (row.ROLE && row.ROLE.toUpperCase() === 'MUALLIM' && row.kelompok) {
                mualims[row.kelompok] = row.Name;
            }
        });
        
        // Create participant list without WhatsApp numbers
        const participants = data
            .filter(row => row.ROLE && row.ROLE.toUpperCase() === 'PESERTA')
            .map(row => {
                return {
                    name: row.Name,
                    nip: row.NIP,
                    kelompok: row.kelompok,
                    mualim: mualims[row.kelompok] || 'Tidak diketahui'
                };
            });
            
        result[matanName] = participants;
    });
    
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
    console.log(`Processed ${files.length} files. Output saved to ${outputFilePath}`);
}

processFiles();
