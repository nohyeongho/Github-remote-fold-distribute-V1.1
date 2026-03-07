const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

let jsStartStr = "if (excelInfoList && Array.isArray(excelInfoList)) {";
let jsStart = content.indexOf(jsStartStr);
let endElseIf = content.indexOf("else if (excelInfoList)", jsStart);
let jsEnd = content.indexOf("}", content.indexOf("`;", endElseIf)) + 1;

if (jsStart > -1 && jsEnd > jsStart) {
    let before = content.substring(0, jsStart);
    let after = content.substring(jsEnd);
    let newJs = `let items = [];
          if (excelInfoList && Array.isArray(excelInfoList)) {
            items = excelInfoList;
          } else if (excelInfoList) {
            items = [excelInfoList];
          }

          if (items.length > 0) {
            const makeMultilineRow = (label, valueFn) => {
              const vals = items.map(valueFn);
              const uniqueVals = [...new Set(vals)];
              if (uniqueVals.length === 1) {
                return \`<p><strong>\${label}:</strong> \${uniqueVals[0]}</p>\`;
              }
              return \`<p><strong>\${label}:</strong><br><span style="padding-left:14px; color:#A50034;">●</span> \${uniqueVals.join('<br><span style="padding-left:14px; color:#A50034;">●</span> ')}</p>\`;
            };

            extraHtml = \`
              <div class="excel-info">
                \${makeMultilineRow('Where to use', e => e.whereToUse)}
                \${makeMultilineRow('Part Number', e => e.partNumber)}
                \${makeMultilineRow('Connector Name', e => e.connectorName)}
                \${makeMultilineRow('Pipe (mm / inch)', e => \`\${e.pipeMm} / \${e.pipeInch}\`)}
              </div>
            \`;
          }`;
    content = before + newJs + after;
    console.log('replaced js');
    fs.writeFileSync(filepath, content, 'utf-8');
} else {
    console.log('could not find js block');
}
