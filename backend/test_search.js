// using native fetch
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 5 }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/search?q=test&type=all', { 
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if(!res.ok) {
        console.error('FAILED STATUS:', res.status);
    }
    
    const text = await res.text();
    console.log('STATUS:', res.status);
    try {
        console.log('JSON DATA:', JSON.stringify(JSON.parse(text), null, 2));
    } catch(e) {
        console.log('RAW TEXT:', text.substring(0, 500));
    }
  } catch(e) { 
      console.error("Fetch Error:", e) 
  }
})();
