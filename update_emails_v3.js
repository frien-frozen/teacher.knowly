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
    // using split join for global replacement of exact strings
    content = content.split(search).join(replace);
  }

  // escape any existing literal backticks
  content = content.replace(/\\`/g, '`'); // unescape first just in case
  content = content.replace(/`/g, '\\`');
  
  return content;
}

// 1. Password Reset
const pwdHtml = processTemplate('knowly-email-reset-password.html', {
  '[Name]': '${user.name}',
  'href="#"': 'href="${resetLink}"'
}, '32px');

if (pwdHtml) {
  let pwdFile = fs.readFileSync('app/actions/password.ts', 'utf8');
  pwdFile = pwdFile.replace(/html:\s*`[\s\S]*?`/, 'html: `\n' + pwdHtml + '\n`');
  pwdFile = pwdFile.replace(/catch \(error\) \{/g, 'catch (error: any) {\n    console.error("🔥 FATAL ERROR IN PASSWORD RESET:", error);');
  fs.writeFileSync('app/actions/password.ts', pwdFile);
}

// 2. Invite
const inviteHtml = processTemplate('knowly-invitation-email.html', {
  '[Name]': '${name}',
  '[Curriculum]': '${currName}',
  '[Subject]': '${subName}',
  'href="#"': 'href="${activateLink}"'
}, '30px');

if (inviteHtml) {
  let invFile = fs.readFileSync('app/actions/invite.ts', 'utf8');
  invFile = invFile.replace(/html:\s*`[\s\S]*?`/, 'html: `\n' + inviteHtml + '\n`');
  fs.writeFileSync('app/actions/invite.ts', invFile);
}


// 3. Application
const accHtml = processTemplate('knowly-email-accepted.html', {
  '[Name]': '${name}',
  '[Curriculum] — [Subject]': '${subject}',
  'href="#"': 'href="${activateLink}"'
}, '32px');

const rejHtml = processTemplate('knowly-email-rejected.html', {
  '[Name]': '${name}',
  '[Curriculum] — [Subject]': '${subject}',
  'href="#"': 'href="${appUrl}"'
}, '32px');

if (accHtml && rejHtml) {
  let appFile = fs.readFileSync('app/actions/application.ts', 'utf8');
  const appParts = appFile.split(/html:\s*`[\s\S]*?`/);
  if (appParts.length === 3) {
    appFile = appParts[0] + 'html: `\n' + accHtml + '\n`' + appParts[1] + 'html: `\n' + rejHtml + '\n`' + appParts[2];
    fs.writeFileSync('app/actions/application.ts', appFile);
  } else {
    console.log("Could not split application.ts properly.");
  }
}

console.log("Script execution complete.");
