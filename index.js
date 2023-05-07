// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// let htmlPath;
// let dataPath;

// rl.question('Enter path to HTML template: ', (answer) => {
//   htmlPath = answer;
//   rl.question('Enter path to data file: ', (answer) => {
//     dataPath = answer;

//     try {
//       if (!fs.existsSync(htmlPath)) {
//         throw new Error(`HTML template file not found at path: ${htmlPath}`);
//       }

//       if (!fs.existsSync(dataPath)) {
//         throw new Error(`Data file not found at path: ${dataPath}`);
//       }

//       const htmlFileExtension = path.extname(htmlPath);
//       const dataFileExtension = path.extname(dataPath);

//       if (htmlFileExtension !== '.html') {
//         throw new Error(`Invalid file type for HTML template. Expected .html, but got ${htmlFileExtension}`);
//       }

//       if (dataFileExtension !== '.json') {
//         throw new Error(`Invalid file type for data file. Expected .json, but got ${dataFileExtension}`);
//       }

//       const html = fs.readFileSync(htmlPath, 'utf-8');
//       const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
			

//       const server = http.createServer((req, res) => {
//         const parsedUrl = url.parse(req.url, true);

//         if (parsedUrl.pathname === '/') {
//           res.setHeader('Content-Type', 'text/html');

					
//           let itemsHtml = '';
//           for (let i = 0; i < data.length; i++) {
//             itemsHtml += `<li>${data[i].name} (${data[i].email}) - ${data[i].phone}</li>`;
//           }
//           const renderedHtml = html.replace('{{data}}', itemsHtml);
//           res.write(renderedHtml);
//           res.end();
//         }
//         else {
//           res.writeHead(404, { 'Content-Type': 'text/plain' });
//           res.end('Not Found');
//         }
//       });

//       server.listen(3000, () => {
//         console.log(`Server running on http://localhost:3000`);
//       });
//     } catch (error) {
//       console.error(error.message);
//     }
//   });
// });

const http = require('http');
const fs = require('fs');
const url = require('url');
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

    let html;
    try {
      html = fs.readFileSync(htmlPath, 'utf-8');

			// Checking if html template includes {{data}} to insert data from json file into it.
			const placeholderRegex = /{{\s*(\w+)\s*}}/g;
      const matches = html.match(placeholderRegex);
      if (!matches || !matches.includes('{{data}}')) {
				console.error('Template is missing {{data}} placeholder');
				rl.close();
				return;
      }
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
