const http = require('http');
const fs = require('fs');
const url = require('url');
// const path = require('path');



const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let htmlPath;
let dataPath;

rl.question('Enter path to HTML template: ', (answer) => {
  htmlPath = answer;
  rl.question('Enter path to data file: ', (answer) => {
    dataPath = answer;

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      // const filePath = path.join(__dirname, parsedUrl.pathname);


      if (parsedUrl.pathname === '/') {
        res.setHeader('Content-Type', 'text/html');
				let itemsHtml = '';
				for (let i = 0; i < data.length; i++) {
					itemsHtml += `<li>${data[i].name} (${data[i].email}) - ${data[i].phone}</li>`;
				}
				const renderedHtml = html.replace('{{data}}', itemsHtml);
				res.write(renderedHtml);
				res.end();
      }
      else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end();
      }
    });

    server.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  });
});
