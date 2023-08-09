console.log("Hello World!")

import { Client } from 'pg';

// Replace these with your actual database credentials
const dbConfig = {
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  host: 'localhost',
  port: 5432,
};

async function connectAndQuery() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to the database');

    const queryResult = await client.query('SELECT * FROM test');
    console.log('Query result:', queryResult.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

connectAndQuery();
