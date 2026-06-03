const { Pool } = require("pg");

const pool = new Pool({

host: process.env.DB_HOST,

port: process.env.DB_PORT,

database: process.env.DB_NAME,

user: process.env.DB_USER,

password: process.env.DB_PASSWORD,

ssl: {

rejectUnauthorized: false

}

});

<<<<<<< HEAD
module.exports = pool;
=======
module.exports = pool;

>>>>>>> 263994d (Update node modules packages)
