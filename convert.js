const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.join(__dirname, 'partner.csv'), 'utf8');

const lines = data.split('\n');
const object = lines.map(line => {
  const [name, country, N, E] = line.split(',');
  return {
    name,
    N: Number(N),
    E: Number(E),
  }
})
console.log(object);