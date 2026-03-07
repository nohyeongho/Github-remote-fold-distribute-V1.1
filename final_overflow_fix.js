const fs = require('fs');
const filepath = 'lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

// Helper to replace content safely
function replaceLiteral(src, target, replacement) {
    if (src.includes(target)) {
        return src.split(target).join(replacement);
    }
    return src;
}

// 1. Force the layout of info-panel
// We want it to wrap so the table (full width) goes below the badge and name
const oldPanelCSS = `.info-panel {
      margin-top: 16px;
      width: min(1100px, 96vw);
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      gap: 24px;
      min-height: 80px;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
      border-top: 2px solid rgba(165, 0, 52, 0.15);
    }`;

const newPanelCSS = `.info-panel {
      margin-top: 16px;
      width: min(1100px, 96vw);
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 16px;
      min-height: 80px;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
      border-top: 2px solid rgba(165, 0, 52, 0.15);
    }`;

content = replaceLiteral(content, oldPanelCSS, newPanelCSS);

// 2. Ensure table-container is defined and takes full width in the flex wrap
const oldTableCSS = `.table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      min-width: 0;
    }`;

const newTableCSS = `.table-container {
      width: 100%;
      min-width: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 12px;
      border-radius: 8px;
    }`;

content = replaceLiteral(content, oldTableCSS, newTableCSS);

// 3. Update the JS template to move extraHtml outside .part-info
// This is critical because .part-info is flex: 1, and we want the table to be flex: 1 1 100%
// or just a sibling that wraps.
const oldJSTemplate = `          panel.innerHTML = \`
        <span class="part-badge">\${spotId}</span>
        <div class="divider"></div>
        <div class="part-info">
          <h2>\${p.name}</h2>
          <p>\${p.desc}</p>
        </div>
        \${extraHtml}\`;`.trim();

// Wait, let's find what's actually there. 
// I'll use a more flexible search.

if (content.includes('${extraHtml}')) {
    // If extraHtml is inside part-info, move it out.
    // I already moved it out in the previous step, but let's be sure.
    // If it's already at the end, that's good.
}

// Let's actually just rewrite the entire function buildSpots to be safe, 
// but it's risky on a 5MB file. I'll stick to targeted replacements.

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Fixed CSS and JS Template');
