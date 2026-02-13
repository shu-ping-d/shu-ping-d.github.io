const CITY_NAME = "Manchester";

// Manchester 座標
const MANCHESTER_LAT = 53.4808;
const MANCHESTER_LON = -2.2426;

function formatDay(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

function formatDate(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

async function fetchWeather() {
  try {
    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${MANCHESTER_LAT}` +
      `&lon=${MANCHESTER_LON}&units=metric&appid=${API_KEY}`;

    const res = await fetch(currentUrl);
    if (!res.ok) {
      throw new Error("Weather API error");
    }

    const currentData = await res.json();
    renderCurrentWeather(currentData);
  } catch (err) {
    console.error(err);
    const current = document.getElementById("current-weather");
    if (current) {
      current.textContent = "Unable to load weather data right now.";
    }
  }
}

function renderCurrentWeather(current) {
  const container = document.getElementById("current-weather");
  if (!container) return;

  const temp = Math.round(current.main.temp);
  const feels = Math.round(current.main.feels_like);
  const desc =
    current.weather && current.weather[0] ? current.weather[0].description : "";

  const icon =
    current.weather && current.weather[0] ? current.weather[0].icon : null;

  const dateLabel = formatDate(current.dt);

  container.innerHTML = `
    <div class="weather-today-main">
      <div class="weather-icon">
        ${
          icon
            ? `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />`
            : "☁️"
        }
      </div>
      <div>
        <div class="weather-today-temp">${temp}°C</div>
        <div class="weather-today-desc">${desc}</div>
      </div>
    </div>
    <div class="weather-today-meta">
      <div>${dateLabel}</div>
      <div>Feels like ${feels}°C</div>
    </div>
  `;
}

function renderWeeklyForecast(days) {
  const container = document.getElementById("weekly-forecast");
  if (!container) return;

  container.innerHTML = days
    .map((d) => {
      const max = Math.round(d.temp.max);
      const min = Math.round(d.temp.min);
      const name = formatDay(d.dt);
      const icon = d.weather && d.weather[0] ? d.weather[0].icon : null;

      return `
        <div class="weather-day">
          <div class="weather-day-name">${name}</div>
          <div class="weather-day-icon">
            ${
              icon
                ? `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />`
                : ""
            }
          </div>
          <div class="weather-day-temp">${max}° / ${min}°</div>
        </div>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", fetchWeather);

// async function getCurrentWeather() {
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     const weatherDiv = document.getElementById("nav-weather-icon");

//     if (data.main) {
//       const temp = data.main.temp.toFixed(0);
//       const desc = data.weather[0].main;
//       const iconCode = data.weather[0].icon;
//       weatherDiv.innerHTML = `
//                 <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}">
//             `;
//     } else {
//       weatherDiv.innerHTML = "無法獲取今日天氣數據。";
//     }
//   } catch (error) {
//     console.error("Error fetching current weather:", error);
//     document.getElementById("current-weather").innerHTML = "載入天氣失敗。";
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   getCurrentWeather();
// });
