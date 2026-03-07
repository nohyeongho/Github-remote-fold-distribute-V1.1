const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

// 1. Add CSS for copy button
let cssToAdd = `
    .copy-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      margin-left: 6px;
      padding: 2px 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .copy-btn:hover {
      background: #e2e8f0;
    }
    .part-number-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
`;
if (!content.includes('.copy-btn {')) {
    content = content.replace('/* Table styles for readability */', cssToAdd + '\n    /* Table styles for readability */');
}

// 2. Add copy utility function
let jsHelper = `
    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert(text + ' 복사되었습니다.');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }

    function buildSpots(parts) {
`;
if (!content.includes('function copyText(text)')) {
    content = content.replace('function buildSpots(parts) {', jsHelper);
}

// 3. Update the table inner HTML to include copy button
let oldHtml = `<td>\${e.partNumber}</td>`;
let newHtml = `<td>
                          <div class="part-number-cell">
                            <span>\${e.partNumber}</span>
                            <button class="copy-btn" onclick="copyText('\${e.partNumber}')" title="복사하기">📋</button>
                          </div>
                        </td>`;
content = content.replace(oldHtml, newHtml);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Copy button added!');
