const fs = require('fs');

const imgTag = '<img src="${appUrl}/knowlylogo.svg" alt="Knowly" style="height: 32px; width: auto; display: block;" />';

['app/actions/invite.ts', 'app/actions/application.ts', 'app/actions/password.ts'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // We want to replace `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 518.07 112.01"...</svg>` with imgTag
    // So something like /<svg[\s\S]*?<\/svg>/g
    content = content.replace(/<svg[\s\S]*?<\/svg>/g, imgTag);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
