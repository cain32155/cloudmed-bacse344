const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let executablePath = null;
  for (const p of edgePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    console.error('No Edge/Chrome executable found');
    process.exit(1);
  }

  console.log(`Using browser executable: ${executablePath}`);
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, '../report.html');
  const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;

  console.log(`Loading HTML from: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve(__dirname, '../BACSE344_CloudMed_Final_Assignment_Report.pdf');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });

  console.log(`✅ PDF successfully generated at: ${outputPath}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
