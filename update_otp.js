const fs = require('fs');

function processTemplate(filename, replacements, svgHeight) {
  if (!fs.existsSync(filename)) {
    console.log("Could not find " + filename + ". Skipping.");
    return null;
  }
  let content = fs.readFileSync(filename, 'utf8');
  
  // Replace SVG with IMG
  const imgTag = `<img src="\${appUrl}/knowlylogo.svg" alt="Knowly" style="height: ${svgHeight}; width: auto; display: block;" />`;
  content = content.replace(/<svg[\s\S]*?<\/svg>/, imgTag);

  // Apply user string replacements
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }

  // escape any existing literal backticks
  content = content.replace(/\\`/g, '`'); // unescape first just in case
  content = content.replace(/`/g, '\\`');
  
  return content;
}

const otpHtml = processTemplate('knowly-email-otp.html', {
  '<p class="salutation">Hello, [Name]</p>': '<p class="salutation">${name ? `Hello, ${name}` : \'Hello\'}</p>',
  '<p class="otp-code">847 291</p>': '<p class="otp-code">${otp}</p>'
}, '32px');

if (otpHtml) {
  let mailFile = fs.readFileSync('lib/mail.ts', 'utf8');
  
  // 1. Update the function signature
  mailFile = mailFile.replace('export async function sendOTPEmail(to: string, otp: string) {', 'export async function sendOTPEmail(to: string, otp: string, name?: string) {\n  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teacher.knowly.uz";');
  
  // 2. Replace the old html string
  // The old one is: html: `<div style="padding: 20px; font-family: sans-serif;"><h1>${otp}</h1><p>Your Knowly login code.</p></div>`,
  mailFile = mailFile.replace(/html:\s*`<div style="padding: 20px; font-family: sans-serif;"><h1>\$\{otp\}<\/h1><p>Your Knowly login code\.<\/p><\/div>`/, 'html: `\n' + otpHtml + '\n`');
  
  fs.writeFileSync('lib/mail.ts', mailFile);
  console.log("Updated lib/mail.ts with OTP HTML.");
} else {
  console.error("OTP template not found.");
}
