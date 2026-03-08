const fs = require('fs');
const file = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split(/\r?\n/);
let inMedia = false;
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@media (max-width: 768px)')) {
        inMedia = true;
    }
    if (inMedia && lines[i].includes('.pkg-search-btn {')) {
        startIdx = i;
    }
    if (startIdx !== -1 && i > startIdx && lines[i].includes('}')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `      .pkg-search-btn {
        position: relative;
        top: auto;
        right: auto;
        width: fit-content;
        max-width: 100%;
        margin: 0 auto 16px auto;
        justify-content: center;
      }`;

    lines.splice(startIdx, endIdx - startIdx + 1, replacement);
    fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
    console.log("Successfully replaced CSS.");
} else {
    console.log("Could not find the target CSS block.");
}
