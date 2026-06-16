const express=require('express');
const db=require('./db');
const app=express();
const stockRoutes = require('./routes/stock');

//Define the port and host
const port=3000;

//middleware to parse json
app.use(express.json());
//Mount the router
app.use('/',stockRoutes);

//Start the server
app.listen(port,() =>{
    console.log(`Server running on http://localhost:${port}`);
});

// app.get('/InventoryDB', async (req, res) => {
//     try {
//         const [results] = await db.query('SELECT * FROM products');
//         res.json(results);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('DB error');
//     }
// });
