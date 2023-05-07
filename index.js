const http = require('http');
const fs = require('fs');
const url = require('url');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let htmlPath;
let dataPath;

rl.question('Enter path to HTML template: ', (answer) => {
  htmlPath = answer;
  rl.question('Enter path to data file: ', (answer) => {
    dataPath = answer;

    let html;
    try {
      checkExtension(htmlPath);

      html = fs.readFileSync(htmlPath, 'utf-8');
      // Checking if html template includes {{data}} to insert data from json file into it.
      checkIfIncludesPlaceholder(html);
    } catch (error) {
      console.error(`Error reading HTML file: ${error.message}`);
      rl.close();
      return;
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      console.error(`Error parsing data file: ${error.message}`);
      rl.close();
      return;
    }

    const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

      if (parsedUrl.pathname === '/') {
        res.setHeader('Content-Type', 'text/html');

				const markup = insertDataIntoTemplate(data);
        const renderedHtml = html.replace('{{data}}', markup);
        res.write(renderedHtml);
        res.end();
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
      }
    });

    server.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  });
});

function checkExtension(htmlPath) {
  const fileExtension = path.extname(htmlPath);
  if (fileExtension !== '.html') {
    throw new Error(
      'Invalid file type. The HTML template file should have .html extension.'
    );
  }
}

function insertDataIntoTemplate(data){
	let itemsHtml = '';
	const keys = Object.keys(data[0]);
	for (let i = 0; i < data.length; i++) {
		let innerData = '';
		for (let j = 0; j < keys.length; j++) {
			if (keys[j] === 'id') continue;
			innerData += `<p><b>${keys[j]}:</b> ${
				data[i][keys[j]]
			}</p>`;
		}
		itemsHtml += `<li>${innerData}</li>`;
	}
	return itemsHtml;
}

function checkIfIncludesPlaceholder(html) {
	const placeholder = '{{data}}';
  if (!html.includes(placeholder)) {
    throw new Error(`Template is missing ${placeholder} placeholder`);
  }
}
