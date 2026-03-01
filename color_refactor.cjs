const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

function replaceColors(content) {
    let newContent = content;

    // Backgrounds (Navy #000080)
    newContent = newContent.replace(/bg-\[\#05070A\]/g, 'bg-navy');
    newContent = newContent.replace(/bg-\[\#0B0F19\]/g, 'bg-navy');
    newContent = newContent.replace(/bg-\[\#0D1117\]/g, 'bg-navy');
    newContent = newContent.replace(/bg-slate-900/g, 'bg-navy');
    newContent = newContent.replace(/bg-slate-800/g, 'bg-navy/80');
    
    // Borders (Slate Gray #6D8196)
    newContent = newContent.replace(/border-slate-[678]00(?:\/\d+)?/g, 'border-slatey/40');
    newContent = newContent.replace(/border-white\/10/g, 'border-slatey/30');
    newContent = newContent.replace(/border-white\/5/g, 'border-slatey/20');
    
    // Primary Accents (Icy Blue #ADD8E6) - for text
    newContent = newContent.replace(/text-cyan-400/g, 'text-icy');
    newContent = newContent.replace(/text-indigo-400/g, 'text-icy');
    newContent = newContent.replace(/text-emerald-400/g, 'text-icy');
    newContent = newContent.replace(/text-purple-400/g, 'text-icy');
    newContent = newContent.replace(/text-amber-400/g, 'text-icy');
    newContent = newContent.replace(/text-rose-400/g, 'text-icy');
    
    // Primary Accents (Icy Blue #ADD8E6) - for backgrounds
    newContent = newContent.replace(/bg-cyan-500/g, 'bg-icy');
    newContent = newContent.replace(/bg-indigo-500/g, 'bg-icy');
    newContent = newContent.replace(/bg-emerald-500/g, 'bg-icy');
    newContent = newContent.replace(/bg-purple-500/g, 'bg-icy');
    newContent = newContent.replace(/bg-amber-500/g, 'bg-icy');
    newContent = newContent.replace(/bg-rose-500/g, 'bg-icy');

    // Soft backgrounds
    newContent = newContent.replace(/bg-cyan-500\/10/g, 'bg-icy/10');
    newContent = newContent.replace(/bg-indigo-500\/10/g, 'bg-icy/10');
    newContent = newContent.replace(/bg-emerald-500\/10/g, 'bg-icy/10');
    newContent = newContent.replace(/bg-purple-500\/10/g, 'bg-icy/10');
    newContent = newContent.replace(/bg-amber-500\/10/g, 'bg-icy/10');
    newContent = newContent.replace(/bg-rose-500\/10/g, 'bg-icy/10');

    // Text overrides
    newContent = newContent.replace(/text-slate-300/g, 'text-snow/90');
    newContent = newContent.replace(/text-slate-400/g, 'text-snow/80');
    newContent = newContent.replace(/text-slate-500/g, 'text-slatey');
    newContent = newContent.replace(/text-slate-600/g, 'text-slatey/80');
    newContent = newContent.replace(/text-\[\#05070A\]/g, 'text-navy');
    newContent = newContent.replace(/text-\[\#0B0F19\]/g, 'text-navy');
    
    // Shadows over cyan/indigo -> to Icy Blue RGBA (173,216,230)
    newContent = newContent.replace(/rgba\(6,182,212/g, 'rgba(173,216,230');
    newContent = newContent.replace(/rgba\(99,102,241/g, 'rgba(173,216,230');

    // Replace text-white with text-snow to ensure absolute consistency
    newContent = newContent.replace(/text-white/g, 'text-snow');
    
    return newContent;
}

let changedFiles = 0;

walk(srcDir, (filePath) => {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = replaceColors(content);
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated: ${filePath}`);
            changedFiles++;
        }
    }
});

console.log(`Total files updated: ${changedFiles}`);
