/* Global Variables */
const owmKey = '789424243e41e1d14e9bb397a929e0a0';
const zipCodeParamName = 'zip';
const apiKeyParamName = 'APPID';
const url = 'https://api.openweathermap.org/data/2.5/weather'


class WeatherApp {
    constructor() {
        this._elements = {
            zip: null,
            feelings: null,
            generate: null,
            entryHolder: null,
            date: null,
            temp: null,
            content: null
        };
    }

    run() {
        this._initControls();
        this._initGenerateButtonHandler();
    }

    _initControls() {
        for (const key in this._elements) {
            if (this._elements.hasOwnProperty(key)) {
                this._elements[key] = document.getElementById(key);

                // should never happen but still better safe than sorry :)
                if (!this._elements[key]) throw 'IDs in HTML have been changed.';
            }
        }
    }

    _initGenerateButtonHandler() {
        this._elements.generate.addEventListener('click', async (ev) => {
            ev.preventDefault();

            try {
                const date = this._getNewDate();
                const zip = this._getZipCode();
                const content = this._getFeelings() || '';

                if (zip) {
                    const owData = await this._getOpenWeatherData(zip);
                    
                    await this._addData({ 
                        temp: owData.main.temp, 
                        date, 
                        content 
                    });

                    const latestData = await this._getData();
                    this._updateUI(latestData);
                } else {
                    alert('ZIP is required!');
                }

            } catch(ex) {
                alert('Errors make me a very sad panda!')
            }
        });
    }

    async _getOpenWeatherData(zipCode) {
        return fetch(this._getOpenWeatherUrl(zipCode, owmKey)).then(r => r.json())
    }

    async _addData(data) {
        return fetch('/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(data)
        }).then(r => r.json());
    }

    async _getData() {
        return fetch('/data').then(r => r.json());
    }

    _updateUI(latestData) {
        for (const key in latestData) {
            if (latestData.hasOwnProperty(key) &&
                this._elements.hasOwnProperty(key)) {

                this._elements[key].innerHTML = latestData[key];
            }
        }
    }

    _getOpenWeatherUrl(zipCode, apiKey) {
        return `${url}?${zipCodeParamName}=${zipCode}&${apiKeyParamName}=${apiKey}`;
    }

    _getZipCode() {
        return this._elements.zip.value;
    }
    _getFeelings() {
        return this._elements.feelings.value;
    }

    _getNewDate() {
        let d = new Date();
        return `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;
    }
}

const app = new WeatherApp();
app.run();