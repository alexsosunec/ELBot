import { Iconv } from "iconv";
import http from "http";

export async function sendJoke(chatId, funcSender) {
  return new Promise((resolve, reject) => {
    let iconv = new Iconv("CP1251", "UTF-8");
    http
      .get("http://rzhunemogu.ru/RandJSON.aspx?CType=1", (res) => {
        let data;
        res.on("data", (chunk) => {
          data += iconv.convert(chunk);
        });
        res.on("end", () => {
          const joke = data.slice(21, data.length - 2);
          funcSender(chatId, joke);
          resolve();
        });
        res.on("error", (err) => {
          reject(err.message);
        });
      })
      .on("error", (err) => {
        reject(err.message);
      })
      .end();
  });
}
