import https from "https";

export async function makeDecision(chatId, funcSender) {
  return new Promise((resolve, reject) => {
    https
      .get("https://yesno.wtf/api", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          data = JSON.parse(data);
          switch (data.answer) {
            case "yes":
              data.answer = "Да";
              break;
            case "no":
              data.answer = "Нет";
              break;
            case "maybe":
              data.answer = "МОЖЕТ БЫТЬ, НО ЭТО НЕ ТОЧНО";
              break;
            default:
              break;
          }
          funcSender(chatId, data.image);
          setTimeout(() => {
            funcSender(chatId, data.answer);
          }, 1000);
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
