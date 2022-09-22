import http from "http";

export async function getWeatherByCoordinates() {
  const DEFAULT_TOKEN = "8c805535880073d24f1b7059004c9f1f";

  const coordinates = [50.0874654, 14.4212535];

  let url = new URL("http://api.openweathermap.org/data/2.5/weather");

  url.searchParams.append("lat", coordinates[0]);
  url.searchParams.append("lon", coordinates[1]);
  url.searchParams.append("appid", DEFAULT_TOKEN);
  url.searchParams.append("units", "metric");
  url.searchParams.append("lang", "RU");

  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
        res.on("error", (err) => {
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err.message);
      });
  });
}

export function printWeather(weather, chatId, funcSender) {
  const emojis = {
    "01d": "🌞",
    "02d": "🌤️",
    "03d": "⛅",
    "04d": "☁️",
    "09d": "🌧️",
    "10d": "🌦️",
    "11d": "🌩️",
    "13d": "❄️",
    "50d": "🌫️",
    "01n": "🌚",
    "02n": "☁️",
    "03n": "☁️",
    "04n": "☁️",
    "09n": "🌧️",
    "10n": "🌧️",
    "11n": "🌩️",
    "13n": "❄️",
    "50n": "🌫️",
  };

  let description = weather?.weather[0];
  let mainParams = weather?.main;
  let iconCode = description?.icon;
  let message = `${emojis[iconCode]}В праге ща ${description?.description} ${emojis[iconCode]}
  Температура ${mainParams?.temp}, но по ощущению ${mainParams?.feels_like} 🌡️
  Давление - ${mainParams?.pressure}гПа. Влажность - ${mainParams?.humidity}% 💦`;

  funcSender(chatId, message);
}
