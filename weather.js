let cityInput = document.getElementById('city_input');
searchBtn = document.getElementById('searchBtn');
locationBtn=document.getElementById('locationBtn');

api_key = '6d7ab31d3f7692ebd2e1f31fa7e948e4'
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0]
fiveDaysForecastCard=document.querySelector('.day-forecast');
aqiCard=document.querySelectorAll('.highlights .card')[0];
// sunriseCard=document.querySelectorAll('.highlighs .card')[0],
humidityVal=document.getElementById('humidityVal'),
pressureVal=document.getElementById('pressureVal'),
visibilityVal=document.getElementById('visibilityVal'),
windSpeedVal=document.getElementById('windSpeedVal'),
feels_Val=document.getElementById('feelsVal'),
hourlyForecastCard= document.getElementById('hourly-forecast'),
aqiList=['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL= `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        fetch(AIR_POLLUTION_API_URL).then(res=>res.json()).then(data=>{
            // console.log(data)
            let {co, no, no2, o3, so2, pm2_5, pm10, nh3}=data.list[0].components;
            aqiCard.innerHTML= `
                <div class="card-head">
                            <p>Air Quality index</p>
                            <p class="air-index aqi-${data.list[0].main.temp}">${aqiList[data.list[0].main.aqi - 1]}</p>
                        </div>
                        <div class="air-indices">
                            <i class="bx bx-wind bx-lg"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="item">
                                <p>SO2</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="item">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="item">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="item">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                        </div>
            `
        }).catch(()=>{
            alert('Failed to fetch Air quality Index.')
        })
    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="bx bx-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="bx bxs-location-plus"></i>${data.name}, ${data.sys.country}</p>
            </div>
        `;
        let{sunrise,sunset}=data.sys,
        {timezone,visibility}=data,
        {humidity, pressure, feels_like}=data.main,
        {speed}=data.wind;
        humidityVal.innerHTML=`${humidity}%`
        pressureVal.innerHTML=`${pressure}hPa`
        visibilityVal.innerHTML=`${visibility}km`
        windSpeedVal.innerHTML=`${speed}m/s`
        feelsVal.innerHTML=`${(feels_like - 273.15).toFixed(2)}&deg;C`

    }
    )
    .catch(() => {
        alert(`Failed to fetch current weather`);
    });


        fetch(FORECAST_API_URL)
        .then(res=>res.json())
        .then(data=>{
            // let hourlyForecast=data.list;
            // hourlyForecastCard.innerHTML='';
            // for(i=0;i<=7;i++){
            //     let hrForecastDate= new Date(hourlyForecast[i].dt_txt);
            //     let hr=hrForecastDate.getHours();
            //     let a='PM';
            //     if(hr<12) a='AM';
            //     if(hr==0) hr=12;
            //     if(hr>12) hr=hr-12;
            //     hourlyForecastCard.innerHTML += `
            //         <div class="card">
            //             <p>${hr}${a}</p>
            //             <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
            //             <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
            //         </div>
            //     `
            // }


            let uniqueForecastDays=[];
            let fiveDaysForecast=data.list.filter(forecast=>{
                let forecastDate=new Date(forecast.dt_txt).getDate();
                if(!uniqueForecastDays.includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate); 
                }
            });
            // console.log(fiveDaysForecast)
            fiveDaysForecastCard.innerHTML='';
            for(i=1;i<fiveDaysForecast.length;i++){
                let date= new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML +=`
                        <div class="forecast-item">
                            <div class="icon-wrapper">
                                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                                <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>    
                `
            }
        }).catch(()=>{
            alert(`Failed to fetch weather forecast`);
        })
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    console.log(cityName)
    cityInput.value = '';
    if (!cityName) return;
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    // console.log(GEOCODING_API_URL)
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        }).catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`)
        })

}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position=>{
        let {latitude, longitude}=position.coords;
        // console.log(latitude, longitude);
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`

        fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
            let {name, country, state}=data[0];
            getWeatherDetails(name, latitude, longitude, country, state);

        }).catch(()=>{
            alert('Failed to fetch user coordinates');
        });
    }),error=>{
        if(error.code===error.PERMISSION_DENIED){
            alert('Geolocation Permission Denied. Please reset location permission to grant access again');
        }
    }
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
cityInput.addEventListener('keyup',e=>e.key==='Enter'&& getCityCoordinates());
window.addEventListener('load', getUserCoordinates)
