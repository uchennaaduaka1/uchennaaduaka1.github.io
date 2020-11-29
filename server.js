// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import pkg from 'sqlite3';

const { open } = pkg;
dotenv.config();

const dbSettings = {
  filename: './tmp/database.db',
  driver: sqlite3.Database,
};

async function databaseInitialize(dbSettings) {
  try {
    const db = new sqlite3.Database(dbSettings.filename);
    db.exec('CREATE TABLE IF NOT EXISTS food (name, category, inspection_date, inspection_results, city, state, zip, owner, type)')
    db.close();
    var data
    data = foodDataFetcher();
    // dataInput(data)
   }
  catch (e) {
    console.log("Error loading Database");

  }
}

async function foodDataFetcher() {
  try {
    const url = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";
	  const response = await fetch(url);

	return (response.json())

  } catch (err) {
    console.error(err);
  }
}

 /* 
  async function dataInput(data) {
  try {
const db = new sqlite3.Database(dbSettings.filename);
for (var i = 0, l = data.length; i < l; i++) {
    db.exec(`INSERT INTO food (name, category, inspection_date, inspection_results, city, state, zip, owner, type) VALUES (data.name, data.category, data.inspection_date, data.inspection_results, data.city, data.state, data.zip, data.owner, data.type)`);
  }
	db.close();	
  }
	catch(e) {
		console.log('Error on insertion');
		console.log(e);
		}
}
   
   );
  
  */



async function databaseRetriever(db) {
  const result = await db.all(`SELECT category, COUNT(restaurant_name) FROM restaurants GROUP BY category`);
  return result;
}



foodDataFetcher();

databaseInitialize(dbSettings);




const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.route('/api')
  .get(async (req, res) => {
    console.log('GET request detected');
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);

    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  });
  app.route('/sql')
  .get((req, res) => {
    console.log('GET detected');
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    // This is where the SQL retrieval function will be:
    // Please remove the below variable
		const db = await open(dbSettings);
    const output = await databaseRetriever(db);
    // This output must be converted to SQL
    res.json(output);
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});