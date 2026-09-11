const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let executablePath = edgePaths.find(p => fs.existsSync(p));
  if (!executablePath) {
    console.error('No Edge/Chrome executable found');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, '../db_report.html');
  const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve(__dirname, '../BACSE344_CloudMed_Comprehensive_Database_Design_and_SQL_Report.pdf');
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

  console.log(`✅ Database Report PDF generated at: ${outputPath}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error(err);
  process.exit(1);
});
