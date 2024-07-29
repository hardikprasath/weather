import { useEffect, useState } from 'react';
import './App.css'

/*Images*/

import clearIcon from "./assets/clear.jpeg";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.jpg";
import rainIcon from "./assets/rain.jpeg";
import windIcon from "./assets/wind.jpeg";
import snowIcon from "./assets/snow.jpeg";
import humidityIcon from "./assets/humidity.jpeg";

const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span> 
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span> 
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt=""  className='icon'/>
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind"  className='icon'/>
          <div className="data">
            <div className="wind-percent">{wind} Km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}



function App() {

  let api_key = "3c33377fc8f0a61bd36000a92657169f";
  const [text, setText] =useState("London");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("London");
  const [country, setCountry] = useState("GB");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap= {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try{
      let res = await fetch(url);
      let data = await res.json();
      if(data.cod ==="404"){
        console.log("City not found");
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon; 
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    }catch(error){
      console.error("An Error Occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    }finally{
      setLoading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
      search();
    }
  };

  useEffect(function(){
    search();
  }, [])

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityInput" placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className="search-icon" onClick={() => search()}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

        <p className="copyright">
          Designed by <span>Prasath</span>
        </p>
      </div>
    </>
  )
}

export default App
