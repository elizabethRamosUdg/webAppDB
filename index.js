const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/all', async (req, res) => {
    try {
      const client = await pool.connect();
      let query = 'SELECT * FROM test_table';
      if (req.query.id != undefined) {
        query = 'SELECT * FROM test_table where id='+ req.query.id;
      }
      const result = await client.query(query);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/all', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/d', async (req, res) => {
    try {
      const client = await pool.connect();
      let query = null;
      if (req.query.id != undefined) {
        query = 'delete FROM test_table where id='+ req.query.id;
      }
      const result = await client.query(query);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/all', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/select', (req, res) => res.render('pages/select'))
  .get('/update', (req, res) => res.render('pages/update'))
  .get('/insert', (req, res) => res.render('pages/insert'))
  .get('/delete', (req, res) => res.render('pages/delete'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
