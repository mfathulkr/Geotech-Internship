const express = require('express');
const app = express();
const Pool = require("./db");
app.use(express.json());


//error test ___


app.get('/reverseGeocoding', async (req, res) => {
  try {
    const token = req.query.token;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const location = req.query.location;
    const user_id_result = await Pool.database.query("SELECT user_id FROM geocoding.users WHERE user_token = $1", [token]);
    if (user_id_result.rows.length == 0) {
      app.get('/reverseGeocoding', function (req, res, next) {
        var e = new Error('User Not Found!');
        e.status = 404;
        next(e);
      });
    }
    let user_id = user_id_result.rows[0].user_id;

    let result = await Pool.database.query(
      `Select city.name as city, country.name as country, country.iso2 as countrycode
      from geocoding.cities city, geocoding.countries as country
      where ST_Intersects((ST_SetSRID(ST_Point(${location}),4326)),city.geom) and 
      ST_Intersects((ST_SetSRID(ST_Point(${location}),4326)),country.geom);`);
    if (!result.rows[0]) {
      result = await Pool.database.query(
        `Select ' - ' as city, country.name as country, country.iso2 as countrycode
          from geocoding.countries as country
          where ST_Intersects((ST_SetSRID(ST_Point(${location}),4326)),country.geom);`);

      app.get('/reverseGeocoding', function (req, res, next) {
        var e = new Error('Bad Request! \n Coordinate Error!');
        e.status = 400;
        next(e);
      });
    }
    if (token == undefined || null) {
      //önceden kullanılmış token  olursa ?
      app.get('/reverseGeocoding', function (req, res, next) {
        var e = new Error('Payment is required! \n Invalid Token!');
        e.status = 402;
        next(e);
      });
    }

    const response = {
      City: result.rows[0].city, Country: result.rows[0].country, CountryCode: result.rows[0].countrycode
    };

    addTransaction(user_id, location, ip);
    res.contentType('application/json');
    res.send(JSON.stringify(response));

  } catch (err) {
    console.error(err.message);
    res.contentType('application/json');
    res.send(err.message);
    return;
  }
})
async function addTransaction(user_id, location, ip) {
  try {
    const updateTodo = await
      Pool.database.query(`
    INSERT INTO geocoding.transactions( user_id, request_type_id, request, request_time, request_ip)  VALUES (${user_id}, 1, '${location}', CURRENT_TIMESTAMP, '${ip}')
    `);
  } catch (err) {
    console.error(err.message);
  }
}


app.get('/geocoding', async (req, res) => {
  try {
    const token = req.query.token;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const address = req.query.city;
    const user_id_result = await Pool.database.query("SELECT user_id FROM geocoding.users WHERE user_token = $1", [token]);
    if (user_id_result.rows.length == 0) {
      throw new Error('User not found!');
    }
    let user_id = user_id_result.rows[0].user_id;
    const result = await Pool.database.query(
      `Select city.name as city, country.name as country,  country.iso2 as countrycode, ST_X(ST_Centroid(city.geom)) as lon, ST_Y(ST_Centroid(city.geom)) as lat
    from geocoding.cities city, geocoding.countries as country
    where city.name ILIKE '%${address}%' AND ST_Intersects(ST_PointOnSurface(city.geom),country.geom);`);


    var response = [];
    result.rows.forEach((element, index) => {
      response.push({ City: element.city, Country: element.country, CountryCode: element.countrycode, lon: element.lon, lat: element.lat });
    });
    addGeocodingTransaction(user_id, address, ip);
    res.contentType('application/json');
    res.send(JSON.stringify(response));
  } catch (err) {
    console.error(err.message);
    res.contentType('application/json');
    res.send(err.message);
    return;
  }
})

async function addGeocodingTransaction(user_id, address, ip) {
  try {
    const updateTodo = await
      Pool.database.query(`
  INSERT INTO geocoding.transactions( user_id, request_type_id, request, request_time, request_ip)  VALUES (${user_id}, 1, '${address}', CURRENT_TIMESTAMP, '${ip}')
  `);
  } catch (err) {
    console.error(err.message);
  }
}

app.listen(3001, () => console.log('listening'))