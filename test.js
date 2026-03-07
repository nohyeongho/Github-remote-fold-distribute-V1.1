const fs = require('fs');
const lines = fs.readFileSync('lockring-search.html', 'utf-8').split('\n');
lines.forEach((line, i) => {
    if (line.length > 2000) {
        console.log(Line  is very long:  characters);
    } else {
        console.log(Line : );
    }
});
