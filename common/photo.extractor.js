import http from "http";
import Stream from "stream";

export async function photoExtractor(url, chatId, funcSender) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = new Stream.Transform();
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          funcSender(chatId, data.read());
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
