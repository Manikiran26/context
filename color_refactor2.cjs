const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walk(dirPath, callback);
        else callback(dirPath);
    });
}

const colors = 'indigo|cyan|emerald|purple|amber|rose|pink|blue|green|red|yellow';
const colorRegex = new RegExp(`(${colors})-[123456789]00(?:\\/\\d+)?`, 'g');

walk(path.join(process.cwd(), 'src'), (fp) => {
    if (fp.endsWith('.jsx') || fp.endsWith('.tsx') || fp.endsWith('.js')) {
        let cnt = fs.readFileSync(fp, 'utf8');
        let src = cnt;
        
        // Exact utilities mapping
        cnt = cnt.replace(new RegExp(`text-(${colors})-[3456]00`, 'g'), 'text-icy');
        cnt = cnt.replace(new RegExp(`bg-(${colors})-[456]00`, 'g'), 'bg-icy text-navy');
        cnt = cnt.replace(new RegExp(`border-(${colors})-[456]00(?:\\/\\d+)?`, 'g'), 'border-icy/30');
        cnt = cnt.replace(new RegExp(`ring-(${colors})-[456]00`, 'g'), 'ring-icy/50');
        cnt = cnt.replace(new RegExp(`hover:bg-(${colors})-[456]00`, 'g'), 'hover:bg-snow transition-colors');
        cnt = cnt.replace(new RegExp(`hover:text-(${colors})-[456]00`, 'g'), 'hover:text-icy');
        cnt = cnt.replace(new RegExp(`from-(${colors})-[456]00(?:\\/\\d+)?`, 'g'), 'from-icy/20');
        cnt = cnt.replace(new RegExp(`via-(${colors})-[456]00(?:\\/\\d+)?`, 'g'), 'via-icy/10');
        cnt = cnt.replace(new RegExp(`to-(${colors})-[456]00(?:\\/\\d+)?`, 'g'), 'to-navy');
        
        // Background Opacities for soft badges
        cnt = cnt.replace(new RegExp(`bg-(${colors})-[456]00\\/10`, 'g'), 'bg-icy/10');
        cnt = cnt.replace(new RegExp(`bg-(${colors})-[456]00\\/20`, 'g'), 'bg-icy/20');

        if (cnt !== src) {
            fs.writeFileSync(fp, cnt, 'utf8');
            console.log('Fixed:', fp);
        }
    }
});
