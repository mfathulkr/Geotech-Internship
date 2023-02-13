const Pool = require('pg').Pool;

const database =  new Pool({
    user:"postgres",
    password:"P@ssw0rd",
    host: "***",
    port: "5432",
    database:"geolocation"
})

module.exports = {database};
