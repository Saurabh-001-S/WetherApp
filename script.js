const worldCity = ['seoul', 'singapore', 'istanbul', 'chicago', 'dubai', 'amsterdam', 'berlin', 'shanghai', 'madrid']
let worldCityIndex = 0;
const submit = document.getElementById('submit');
const search = document.getElementById('search');
const options = {
  method: 'GET',
  headers: {
    // 'X-RapidAPI-Key': 'fff934416amsh66c1f4e356b50c5p1e5cc2jsn9b507f095591',
    'X-RapidAPI-Key': 'af472dcce7msha200de18438a4fbp1be23bjsn66d55bd86337',
    'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
  }
};

submit.addEventListener('click', (e) => {
  e.preventDefault();
  const ulElement = document.getElementById('phourTemp');
  ulElement.innerHTML = '';

  setWeatherData(search.value.toLowerCase(), 8);
  search.value = '';
});

const clickLink = (showCityweather, e) => {
  e.preventDefault();
  console.log('click ', showCityweather)
  document.getElementById(showCityweather).remove();
  document.getElementById('phourTemp').innerHTML = '';
  setWeatherData(showCityweather.toLowerCase(), 8);

  if (worldCityIndex === worldCity.length - 1) worldCityIndex = 0;
  else {
    otherCityWeather(worldCity[worldCityIndex]);
    worldCityIndex++;
  }
}

const locationInfo = async (query) => {
  const URL = `https://foreca-weather.p.rapidapi.com/location/search/${query}?lang=en`;
  try {
    const response = await fetch(URL, options);
    const result = await response.json();
    return [result.locations[0].name, result.locations[0].country, result.locations[0].id];
  } catch (error) {
    console.error(error);
  }
}

const weatherReport = async (id, period) => {
  const weatherURL = `https://foreca-weather.p.rapidapi.com/forecast/daily/${id}?periods=${period}&dataset=full`;
  try {
    const weather = await fetch(weatherURL, options);
    const result = await weather.json();
    const weatherResult = [];
    for (const key in result.forecast) {
      weatherResult.push(result.forecast[key])
    }
    return weatherResult;
  } catch (error) {
    console.error(error);
  }
}

const hourlyTemp = async (id, period) => {
  const url = `https://foreca-weather.p.rapidapi.com/forecast/3hourly/${id}?alt=0&tempunit=C&windunit=MS&tz=Europe%2FLondon&periods=${period}&dataset=full&history=0'`;
  try {
    const weather = await fetch(url, options);
    const result = await weather.json();
    const weatherResult = [];
    for (const key in result.forecast) {
      weatherResult.push(result.forecast[key])
    }
    return weatherResult;
  } catch (error) {
    console.error(error);
  }
}

const setWeatherData = async (cityName, period) => {
  const location = await locationInfo(cityName);
  let id = location[2];
  const result = await weatherReport(id, period);

  todayweatherimg.innerHTML = `<img src="./Icons/${result[0].symbolPhrase}.png" alt="weather">`;
  city.innerHTML = location[0];
  country.innerHTML = location[1];
  symbolPhrase.innerHTML = result[0].symbolPhrase;
  maxTemp.innerHTML = result[0].maxTemp;
  date.innerHTML = result[0].date;
  maxWindSpeed.innerHTML = result[0].maxWindSpeed;
  maxRelHumidity.innerHTML = result[0].maxRelHumidity;
  windDir.innerHTML = result[0].windDir;
  windDir2.innerHTML = result[0].windDir;
  sunrise.innerHTML = result[0].sunrise;
  sunset.innerHTML = result[0].sunset;
  minVisibility.innerHTML = result[0].minVisibility;
  pressure.innerHTML = result[0].pressure;
  maxDewPoint.innerHTML = result[0].maxDewPoint;
  maxFeelsLikeTemp.innerHTML = result[0].maxFeelsLikeTemp;
  precipProb.innerHTML = result[0].precipProb;
  uvIndex.innerHTML = result[0].uvIndex;
  uvIndex2.innerHTML = result[0].uvIndex;

  const hourTemp = await hourlyTemp(id, period)
  next7DaysWeather(result);
  hourTempRender(hourTemp)
}

const next7DaysWeather = (result) => {
  result.slice(1).forEach((element) => {
    document.querySelector('.n7day_ul').innerHTML +=
      `
      <li class="flexRow" >
      <div class="w_temp flexRow">
        <img src="./Icons/${element.symbolPhrase}Icon.png" alt="cloud">
        <span class="second_text second_fSize">${element.maxTemp}&deg;C</span>
      </div>
      <p class="second_text second_fSize"
      style="text-transform: capitalize;" >${element.symbolPhrase}</p>
      <p class="third_text second_fSize">${element.date}</p>
    </li >
  `;
  });
}

const hourTempRender = (result) => {
  result.slice(1).forEach((element) => {
    let hour = element.time.slice(11, element.time.length - 9);
    let PmAm = ''; hour <= 12 ? PmAm = 'AM' : PmAm = 'PM';

    document.querySelector('.pdayTemp').innerHTML +=
      `
       <li class='flexCol tempList'>
        <img src="./Icons/moon.png" alt="moon">
        <span class="second_text">${element.temperature}&deg;</span>
        <span class="third_text">${hour} ${PmAm}</span>
      </li>
  `;
  });
}

const otherCityWeather = async (city) => {
  const location = await locationInfo(city);
  let id = location[2];
  const result = await weatherReport(id, 1);
  let imgUrl = "";
  let position = "bottom";

  if (result[0].symbolPhrase === 'showers' ||
    result[0].symbolPhrase === 'thunderstorms' ||
    result[0].symbolPhrase === 'light rain') imgUrl = "rainybg";

  else if (result[0].symbolPhrase === 'mostly clear'
    || result[0].symbolPhrase === 'clear') {
    imgUrl = "sunnybg";
    position = 'center';
  }
  else imgUrl = "cloudybg";

  document.querySelector('.oCity_ul').innerHTML +=
    `
       <li class="glassbg list"  style="background: url(./Icons/${imgUrl}.jpg) no-repeat center ${position};" id='${location[0]}'>
         <div class="listBg flexRow lista"  onclick="clickLink('${location[0]}',event)">
           <div class="oCityDetails flexCol">
             <p class="second_text second_fSize">${location[1]}</p>
             <p class="second_text second_fSize">${location[0]}</p>
             <p class="second_text second_fSize">${result[0].symbolPhrase}</p>
            </div>
           <div class="oCityTemp">
             <p class="second_text head_fSize">${result[0].maxTemp}&deg;C</p>
           </div>
         </div>
       </li >
  `;
}

setWeatherData("kanpur", 8);
otherCityWeather('delhi');
otherCityWeather('madrid');
otherCityWeather('california');
otherCityWeather('las vegas');
otherCityWeather('vatican city');