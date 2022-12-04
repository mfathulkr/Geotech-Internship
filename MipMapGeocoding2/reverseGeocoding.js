const axios = require('axios')

let address;
function reverseGeocode(){
    axios
    .post('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=TR&featureTypes=&location=35,38' 
    )
    .then(res => {
      address= res.data;
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
      console.log('ssssssssssssss');
      console.log(address);
      return address;
    })
    .catch(error => {
      console.error(error)
    })
}

exports.reverseGeocode=reverseGeocode;
exports.address=address;