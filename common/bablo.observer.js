import dedent from "dedent";
import request from "request-promise";

export default class BabloObserver {
  _result = "";
  _urls = [
    "https://cdn.cur.su/api/nbu.json",
    "https://cdn.cur.su/api/cbr.json",
    "https://cdn.cur.su/api/tcmb.json",
    "https://cdn.cur.su/api/cnb.json",
    "https://cdn.cur.su/api/cbar.json",
    "https://cdn.cur.su/api/nbrb.json",
    "https://cdn.cur.su/api/nbkz.json",
    "https://cdn.cur.su/api/bnb.json",
  ];
  _dictionary = {
    nbu: "Хохлов 🇺🇦",
    cbr: "Вовки 🇷🇺",
    tcmb: "Турков 🇹🇷",
    cnb: "Чехов 🇨🇿",
    cbar: "Азеров 🇦🇿",
    nbrb: "Батьки 🇧🇾",
    nbkz: "Казахов 🇰🇿",
    bnb: "Болгар 🇧🇬",
  };
  get result() {
    if (this._result === "") {
      return "Собираем данные по валютам. Попробуйте еще раз.";
    } else {
      return this._result;
    }
  }

  get urls() {
    return this._urls;
  }

  fetchData() {
    console.log("Fetch data");

    const promises = this._urls.map((url) => request(url));
    Promise.all(promises)
      .then((data) => {
        let fetchRes = "";
        for (let index in data) {
          let bank = data[index];
          bank = JSON.parse(bank);
          let EURInfo;
          bank.rates.hasOwnProperty("EUR")
            ? (EURInfo = `<u>${bank.rates.EUR.toFixed(
                3
              )}</u> <b>€</b> <i>гейских</i>`)
            : (EURInfo = "Они не знают про евро");
          let CZKInfo;
          bank.rates.hasOwnProperty("CZK")
            ? (CZKInfo = `<u>${bank.rates.CZK.toFixed(
                3
              )}</u> <b>Kč</b> <i>чешских</i>`)
            : (CZKInfo = "Они не знают про кроны");
          let RUBInfo;
          bank.rates.hasOwnProperty("RUB")
            ? (RUBInfo = `<u>${bank.rates.RUB.toFixed(
                3
              )}</u> <b>₽</b> <i>деревянных</i>`)
            : (RUBInfo = "Они не знают про рубль");
          fetchRes += `
          По мнению ${this._dictionary[bank.source]} 1<b>$</b> равен:
              ${EURInfo}
              ${CZKInfo}
              ${RUBInfo}
              `;
        }
        this._result = dedent(fetchRes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  init() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 86400000);
  }

  constructor() {
    let now = new Date();
    let hoursRest = 23 - now.getHours();
    let minutesRest = 60 - now.getMinutes();
    let milRest = (hoursRest * 60 + minutesRest) * 60000;
    this.fetchData();
    setTimeout(() => {
      this.init();
    }, milRest);
  }
}
