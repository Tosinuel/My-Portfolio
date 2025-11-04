// extract-docx.js
// Scans the parent Projects folder for .docx files and writes text versions to ./content

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const projectsDir = path.join(__dirname, '..', '..'); // this should point to the Projects folder
const outDir = path.join(__dirname, '..', 'content');

if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function safeName(name){
  return name.replace(/[^a-z0-9]+/gi,'-').replace(/(^-|-$)/g,'').toLowerCase();
}

console.log('Scanning', projectsDir);

fs.readdir(projectsDir, (err, files)=>{
  if(err) return console.error('Failed to read projects dir', err);
  const docs = files.filter(f=>/\.docx?$/i.test(f));
  if(docs.length === 0) return console.log('No .docx files found in', projectsDir);

  docs.forEach(file=>{
    const full = path.join(projectsDir, file);
    mammoth.extractRawText({path: full})
      .then(result=>{
        const text = result.value;
        const outName = safeName(file.replace(/\.docx?$/i,'')) + '.txt';
        const outPath = path.join(outDir, outName);
        fs.writeFileSync(outPath, text, 'utf8');
        console.log('Wrote', outPath);
      })
      .catch(e=>console.error('Failed to convert', file, e));
  });
});
