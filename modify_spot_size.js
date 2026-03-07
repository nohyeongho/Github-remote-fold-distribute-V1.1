const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

// Replace the spot CSS with smaller clamp values
let spotRegex = /\.spot\s*\{[\s\S]*?z-index:\s*10;\s*\}/;
let newSpot = `.spot {
      position: absolute;
      transform: translate(-50%, -50%);
      width: clamp(16px, 2.2vw, 26px);
      height: clamp(16px, 2.2vw, 26px);
      border-radius: 50%;
      background: #A50034;
      border: 2px solid #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: clamp(9px, 1.2vw, 13px);
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(165, 0, 52, 0.25);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, background 0.2s;
      z-index: 10;
    }`;

content = content.replace(spotRegex, newSpot);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Spot size updated');
