// Selectors
const mapContainer = document.querySelector('#map');
const form = document.querySelector('.header-search__form');
const inputBox = document.querySelector('.header-search__form--input');
const ipContainer = document.querySelector('.ip__address span');
const locationContainer = document.querySelector('.ip__location span');
const timezoneContainer = document.querySelector('.ip__timezone span');
const ispContainer = document.querySelector('.ip__isp span');
console.log(inputBox);
let map;
class IpGeoLocation {
    data = {
        ip : '8.8.8.8',
        location: 'California, US',
        isp: 'Google LLC',
        timezone: '-07:00',
        coords: [37.38605, -122.08385]
    }
    constructor() {
        // Event Listeners
        form.addEventListener('submit', this._handleSearch.bind(this));

        this._renderData(this.data);

        map = L.map(mapContainer).setView(this.data.coords, 13);
        this._renderMap(this.data.coords);
        
    }

    _handleSearch(e) {
        // Prevent default beahvior
        e.preventDefault();

        // Get IP adress from user
        this.data.ip = this._getUserSearchQuery();
        // console.log(this.data.ip);

        // Get data from API base on IP
        this._getData(this.data.ip);

        
    }

    _getUserSearchQuery() {
        const ip = inputBox.value;
        return ip;
    }

    async _getData(ip) {
        const API_KEY = 'at_3qaobxQMXAzVFr9Wi4jmLxooRRMPs';
        try {
            const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${ip}`);
            const data = await response.json();
            this.data.ip = data.ip;
            this.data.location = `${data.location.region}, ${data.location.country}`;
            this.data.timezone = data.location.timezone;
            this.data.isp = data.isp;
            this.data.coords[0] = data.location.lat;
            this.data.coords[1] = data.location.lng;

            // Render Data
            this._renderData(this.data);

            // Render Map
            this._moveToLocation(this.data.coords);


        } catch(err) {
            console.log('our err', err);
        }
    }

    _renderMap(coordinates) {
        console.log(coordinates);
        
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coordinates)
        .addTo(map);
    }

    _moveToLocation(coordinates) {
        map.setView(coordinates, 13);

        L.marker(coordinates)
        .addTo(map);
    }

    _renderData(data) {
        ipContainer.innerText = data.ip;
        locationContainer.innerText = data.location;
        timezoneContainer.innerText = data.timezone;
        ispContainer.innerText = data.isp;
    }

}
const ipToGeoLocation =  new IpGeoLocation();
