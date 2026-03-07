const fs = require('fs');
let c = fs.readFileSync('lockring-search.html', 'utf-8');

// ─── 1. Move the table OUTSIDE of .part-info in the JS template ───────────
// Current structure: panel > [part-badge, divider, part-info[h2, p, TABLE]]
// New structure:     panel > [part-badge, divider, part-info[h2, p]] + TABLE (full width)

const oldInner = `          panel.innerHTML = \`\r\n        <span class="part-badge">\${spotId}</span>\r\n        <div class="divider"></div>\r\n        <div class="part-info">\r\n          <h2>\${p.name}</h2>\r\n          <p>\${p.desc}</p>\r\n          \${extraHtml}\r\n        </div>\`;\r\n        });`;

const newInner = `          panel.innerHTML = \`\r\n        <span class="part-badge">\${spotId}</span>\r\n        <div class="divider"></div>\r\n        <div class="part-info">\r\n          <h2>\${p.name}</h2>\r\n          <p>\${p.desc}</p>\r\n        </div>\r\n        \${extraHtml}\`;\r\n        });`;

if (c.includes('panel.innerHTML = `')) {
    if (c.includes(oldInner)) {
        c = c.replace(oldInner, newInner);
        console.log('Template restructured: table moved outside part-info');
    } else {
        console.log('Exact match not found. Trying regex...');
        // Try regex approach
        c = c.replace(
            /(panel\.innerHTML = `[\s\S]*?<div class="part-info">[\s\S]*?<p>\$\{p\.desc\}<\/p>\r?\n)\s*(\$\{extraHtml\})\r?\n\s*(<\/div>`;\r?\n\s*\}\);)/,
            (match, before, extra, after) => {
                console.log('Regex matched!');
                return before + '        </div>\n        ${extraHtml}`;\n        });';
            }
        );
    }
} else {
    console.log('panel.innerHTML not found at all');
}

// ─── 2. Update CSS: make .table-container span full panel width ────────────
// The table container is now a direct flex child of panel - needs full width
if (c.includes('.table-container {')) {
    c = c.replace(
        '.table-container {\r\n      overflow-x: auto;\r\n      -webkit-overflow-scrolling: touch;\r\n      width: 100%;\r\n      min-width: 0;\r\n    }',
        '.table-container {\r\n      overflow-x: auto;\r\n      -webkit-overflow-scrolling: touch;\r\n      width: 100%;\r\n      min-width: 0;\r\n      flex: 1 1 100%;\r\n    }'
    );
    console.log('table-container CSS updated');
}

fs.writeFileSync('lockring-search.html', c, 'utf-8');

// Verify
let hasMoved = !c.includes('${extraHtml}\r\n        </div>`');
let hasFlexFull = c.includes('flex: 1 1 100%;');
console.log('extraHtml outside part-info:', hasMoved, '| table-container flex full:', hasFlexFull);
