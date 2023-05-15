async function fetchCountryName(code) {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await response.json();
    return data[0].name.common;
}