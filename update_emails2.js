const fs = require('fs');

const raw = fs.readFileSync('knowly-email-templates.html', 'utf8');

// The styles are between <style> and </style>
const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

// Function to extract email content by id
function extractEmail(id) {
  const marker = `id="${id}"`;
  const idx = raw.indexOf(marker);
  if (idx === -1) return '';
  
  // Find the `<div class="email">` inside this block
  const emailStart = raw.indexOf('<div class="email">', idx);
  // It's manually formatted so let's find the closing of this email block.
  // Actually, we can use a simpler approach: regex or split
  // The structure is `<div class="email-wrap" id="xyz"> \n <div class="email"> ... </div> \n </div>`
  
  let depth = 0;
  let str = '';
  // Let's just do a naive split based on the well known comments
  return str;
}

// Manually extract using string boundaries based on the file content.
// reset password: id="reset"
let resetBlock = raw.split('id="reset">')[1].split('<!-- ════════════════════════════════')[0];
// cut the last </div> \n </div> \n
resetBlock = resetBlock.substring(0, resetBlock.lastIndexOf('</div>', resetBlock.lastIndexOf('</div>') - 1));

// accepted: id="accepted"
let acceptedBlock = raw.split('id="accepted">')[1].split('<!-- ════════════════════════════════')[0];
acceptedBlock = acceptedBlock.substring(0, acceptedBlock.lastIndexOf('</div>', acceptedBlock.lastIndexOf('</div>') - 1));

// rejected: id="rejected"
let rejectedBlock = raw.split('id="rejected">')[1].split('<!-- /canvas -->')[0];
rejectedBlock = rejectedBlock.substring(0, rejectedBlock.lastIndexOf('</div>', rejectedBlock.lastIndexOf('</div>') - 1));

function wrapEmail(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Knowly</title>
  <style>${styles}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

let resetHtml = wrapEmail(resetBlock);
resetHtml = resetHtml.replace(/\[Name\]/g, '${name || "Educator"}') // Note, in password reset there is no 'name' variable explicitly selected early, ah wait. Does executePasswordReset / requestPasswordReset know the name? 
// app/actions/password.ts has only email. 
// "Hello, [Name]" should just be "Hello," or "Hello, Educator" or user.name. 
// The user request says: "If my provided HTML contains hardcoded placeholder text (like 'John Doe' or 'https://example.com'), you must intelligently swap them out for the correct local variables present in that specific server action."
// requestPasswordReset only has: user.name is available! We can use `${user.name}`. Wait, `if (!user)` returns early success with fake response.
// So user.name is definitely there!

resetHtml = resetHtml.replace(/\[Name\]/g, '${user.name}');
resetHtml = resetHtml.replace('href="#"', 'href="${resetLink}"');

let accHtml = wrapEmail(acceptedBlock);
accHtml = accHtml.replace(/\[Name\]/g, '${name}')
  .replace(/\[Curriculum\]( — \[Subject\]|)/g, '${subject}') // The script used 'subject'. Because the app provides "subject" dynamically as string 
  // Wait, in app/actions/application.ts: `resolveApplication(..., subject: string, ...)`
  // "subject" is the combined name in the dashboard like "Cambridge IGCSE - Mathematics" OR it's just the subject name. Let's use `${subject}` 
  .replace(/\[Curriculum\] — \[Subject\]/g, '${subject}')
  .replace('href="#"', 'href="${activateLink}"');

let rejHtml = wrapEmail(rejectedBlock);
rejHtml = rejHtml.replace(/\[Name\]/g, '${name}')
  .replace(/\[Curriculum\] — \[Subject\]/g, '${subject}')
  .replace(/\[Subject\]/g, '${subject}')
  .replace('href="#"', 'href="https://www.knowly.uz"');

// Update password.ts
let pwdFile = fs.readFileSync('app/actions/password.ts', 'utf8');
pwdFile = pwdFile.replace(/html:\s*`[\s\S]*?`/, 'html: `\n' + resetHtml + '\n`');
fs.writeFileSync('app/actions/password.ts', pwdFile);

// Update application.ts
// It has two `html: \`...\`` blocks
let appFile = fs.readFileSync('app/actions/application.ts', 'utf8');
const approvedHtmlStart = appFile.lastIndexOf('html: `<div style="font-family: sans-serif; padding: 20px;">', appFile.indexOf('} else {'));
// Wait, we can use simple replace because the first html: is in the APPROVED block, the second is in the REJECTED block
const appParts = appFile.split('html: `');
// appParts[0] is up to APPROVED
// appParts[1] is APPROVED html
// appParts[2] is REJECTED html
const afterAppHtml = appParts[1].substring(appParts[1].indexOf('`') + 1);
const afterRejHtml = appParts[2].substring(appParts[2].indexOf('`') + 1);

appFile = appParts[0] + 'html: `\n' + accHtml + '\n`' + afterAppHtml.split('html: `<div')[0] + 'html: `\n' + rejHtml + '\n`' + afterRejHtml;
// Actually the split is safer if we just do:
appFile = appFile.replace(/html:\s*`<div style="font-family: sans-serif; padding: 20px;">\s*<h2>Welcome[\s\S]*?<\/div>`/, 'html: `\n' + accHtml + '\n`');
appFile = appFile.replace(/html:\s*`<div style="font-family: sans-serif; padding: 20px;">\s*<p>Dear[\s\S]*?<\/div>`/, 'html: `\n' + rejHtml + '\n`');

fs.writeFileSync('app/actions/application.ts', appFile);
console.log('Update application & password done.');
