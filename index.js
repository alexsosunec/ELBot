import TelegramBot from "node-telegram-bot-api";
import chalk from "chalk";
import { photoExtractor } from "./common/photo.extractor.js";
import { makeDecision } from "./common/decision.maker.js";
import { sendJoke } from "./common/joke.randomizer.js";
import { getWeatherByCoordinates, printWeather } from "./common/weather.js";
import BabloObserver from "./common/bablo.observer.js";

const token = "5747079716:AAF-SxSEgrsmppY46PBM9CoguWaC2ksES7o";
const url = "http://192.168.0.241:8080/shot.jpg";
const bot = new TelegramBot(token, { polling: true });
const bablo = new BabloObserver();

bot.onText(/\/start/, (msg) => {
  console.log(chalk.black.bgGreen("New Start request!"));
  bot.sendMessage(
    msg.chat.id,
    `Дарова.
    /photo - скину фотку из окна
    /pogoda - покажу погоду в праге
    /joke - скину случайный тупой анекдот из интернета этого вашего
    /otvet - случайно отвечу "да" или "нет"
    /bablo - покажу курс валют разных банков`
  );
});

bot.onText(/\/photo/, async (msg) => {
  console.log(chalk.black.bgGreen("New [Photo] request!"));

  bot.sendMessage(msg.chat.id, "Понял принял, ща сделаю и пришлю.");

  try {
    await photoExtractor(url, msg.chat.id, bot.sendPhoto.bind(bot));
  } catch (error) {
    console.log(chalk.black.bgRedBright(error));
    bot.sendMessage(msg.chat.id, "Фотокамера на ремонте. Потом как-нибудь.");
  }
});

bot.onText(/\/pogoda/, async (msg) => {
  console.log(chalk.black.bgGreen("New [Weather] request!"));
  let weather;
  try {
    weather = await getWeatherByCoordinates();
    printWeather(weather, msg.chat.id, bot.sendMessage.bind(bot));
  } catch (error) {
    console.log(chalk.black.bgRedBright(error));
    bot.sendMessage(msg.chat.id, "Метеорологи забухали. Погоду не говорят.");
  }
});

bot.onText(/\/joke/, async (msg) => {
  console.log(chalk.black.bgGreen("New [Joke] request!"));
  try {
    await sendJoke(msg.chat.id, bot.sendMessage.bind(bot));
  } catch (error) {
    console.log(chalk.black.bgRedBright(error));
    bot.sendMessage(msg.chat.id, "Шутки закончились. Привезут попозже.");
  }
});

bot.onText(/\/otvet/, async (msg) => {
  console.log(chalk.black.bgGreen("New [Decision] request!"));
  try {
    makeDecision(msg.chat.id, bot.sendMessage.bind(bot));
  } catch (error) {
    console.log(chalk.black.bgRedBright(error));
    bot.sendMessage(
      msg.chat.id,
      "Решатель ничего не смог решить. Прямо как ты."
    );
  }
});

bot.onText(/\/bablo/, (msg) => {
  console.log(chalk.black.bgGreen("New Bablo request!"));
  bot.sendMessage(msg.chat.id, bablo.result, { parse_mode: "HTML" });
});

//* MiddleWar
bot.on("message", async (msg) => {
  console.log(msg);
});
