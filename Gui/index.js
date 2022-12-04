
const submitG = document.getElementById('submitG');
const submitRevGeo = document.getElementById('submitRevGeo');
const resultG = document.getElementById('resultG');
const resultRevGeo = document.getElementById('resultRevGeo');
const cityInput = document.getElementById('cityInput')
const locationInput = document.getElementById('locationInput')
const tokenInputG = document.getElementById('tokenInputG');
const tokenInputRevGeo = document.getElementById('tokenInputRevGeo');

submitG.addEventListener('click', ()=> {

    
    const input= {token: tokenInputG.value, city: cityInput.value}

    let myJson = JSON.stringify(input);

    // const url= "https://api.mipmap.nl/reverseGeocoding?location=57,65&token=d2adf4ab-4348-4f58-a52c-5a54891a2bc4";

    const url=`https://api.mipmap.nl/geocoding?city=${cityInput.value}&token=${tokenInputG.value}`;

    loadXMLDoc(url);
    resultG.innerHTML=myJson;


})

submitRevGeo.addEventListener('click', ()=> {


    const input= {token: tokenInputRevGeo.value, location: locationInput.value}

    let myJson = JSON.stringify(input);

    // const url= "https://api.mipmap.nl/reverseGeocoding?location=57,65&token=d2adf4ab-4348-4f58-a52c-5a54891a2bc4";

    const url=`https://api.mipmap.nl/reverseGeocoding?location=${locationInput.value}&token=${tokenInputRevGeo.value}`;

    loadXMLDoc(url);
    resultRevGeo.innerHTML=myJson;


})

function loadXMLDoc(myurl) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", myurl, true);
    xmlhttp.send();
    return xmlhttp.onreadystatechange();
}