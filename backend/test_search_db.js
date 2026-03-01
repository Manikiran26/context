const fetch = globalThis.fetch || require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

(async () => {
    try {
        const uR = await db.query("SELECT user_id FROM context_members WHERE status = 'active' LIMIT 1");
        if(uR.rows.length === 0) return console.log('no members');
        const u = uR.rows[0];
        
        let query = 'a';
        const itR = await db.query('SELECT title FROM notes n JOIN context_members cm ON cm.context_id=n.context_id WHERE cm.user_id=$1 LIMIT 1', [u.user_id]);
        if(itR.rows.length > 0) query = itR.rows[0].title.substring(0,3);

        const token = jwt.sign({ id: u.user_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        const url = 'http://localhost:5000/api/search?q=' + encodeURIComponent(query) + '&type=all';
        console.log('Fetching:', url);
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
        
        const text = await res.text();
        const data = JSON.parse(text);
        
        console.log('Hits:', data.length);
        if(data.length > 0) console.log('Shape: ', Object.keys(data[0]));
        
    } catch(e) { 
        console.error('Error', e) 
    } finally { 
        process.exit(); 
    }
})();
