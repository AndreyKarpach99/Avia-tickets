import api from '../services/apiServices';

class Location {
  constructor(api) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
  }
  async init() {
    const responce = await Promise.all([
      this.api.countries(),
      this.api.cities()
    ]);
    const [countries, cities] = responce;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    return responce;
  }

  getCityCodeByKey(key) {
    return this.cities[key].code;
  }

  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [key]) => {
      acc[key] = null;
      return acc;
    }, {})
  }

  serializeCountries(countries) {
    // {CountryCode: {...}}

    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {})
  }

  serializeCities(cities) {
    // {'City name, Country name:' {...}}
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      const city_name = city.name || city.name_translations.en;
      const key = `${city_name},${country_name}`;
      acc[key] = city;
      return acc;
    }, {})
  }

  getCountryNameByCode(code) {
    return this.countries[code].name;
  }

  async fetchTickets(params) {
    const responce = await this.api.prices(params);
    console.log(responce);
  }
}

const locations = new Location(api);

export default locations;