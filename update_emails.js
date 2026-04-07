const fs = require('fs');

// 1. UPDATE INVITE EMAIL
const inviteRaw = fs.readFileSync('knowly-invitation-email.html', 'utf8');
const inviteHtml = inviteRaw
  .replace(/\[Name\]/g, '${name}')
  .replace(/\[Curriculum\]/g, '${currName}')
  .replace(/\[Subject\]/g, '${subName}')
  .replace('href="#"', 'href="${activateLink}"')
  .replace(/`/g, '\\`'); // escape literal backticks just in case (none exist but safe)

const inviteFile = fs.readFileSync('app/actions/invite.ts', 'utf8');
const inviteUpdated = inviteFile.replace(
  /html:\s*`[\s\S]*?`/,
  'html: `\n' + inviteHtml + '\n`'
);
fs.writeFileSync('app/actions/invite.ts', inviteUpdated);
console.log('Updated invite.ts');

