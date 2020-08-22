const users = require("./users");
const fs = require("fs");
const path = require("path");
const { Telegram } = require("telegraf");

const { TOKEN } = process.env;
const telegram = new Telegram(TOKEN);

module.exports = class UserManagement {
  static async saveNewUser(user) {
    const temp = users.filter((el) => el.id !== user.id);
    temp.push(user);
    UserManagement._saveFile(temp);
    return;
  }

  static _saveFile(data) {
    fs.writeFileSync(path.resolve(__dirname, "users.json"), JSON.stringify(data));
  }

  static async sendNewsletter(text, ctx) {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "users.json"), "utf-8"));
    const arreyPromis = [];
    let sucs = 0;
    const error = [];
    data.forEach(({ id }) => {
      arreyPromis.push(
        telegram
          .sendMessage(id, text)
          .then((res) => (sucs += 1))
          .catch((err) => (err.code === 403 ? error.push(err.on.payload.chat_id) : null))
      );
    });

    Promise.all(arreyPromis)
      .then()
      .catch()
      .finally(() => {
        delUsers(error);
        ctx.reply(`Кількість користувачів які отримали повідомлення  - ${sucs}`);
      });
  }
};

function delUsers(arr) {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "users.json"), "utf-8"));

  arr.forEach((el) => {
    data.includes(el);
    if (data.includes(el)) {
      data.splice(data.indexOf(el), 1);
    }
  });
  fs.writeFileSync(path.resolve(__dirname, "users.json"), JSON.stringify(data));
}
