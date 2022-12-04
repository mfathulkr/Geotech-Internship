const Pool = require('pg').Pool;

const database =  new Pool({
    user:"postgres",
    password:"P@ssw0rd",
    host: "172.16.16.11",
    port: "5432",
    database:"geolocation"
})

module.exports = {database};