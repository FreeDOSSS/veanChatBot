const users = require("./users");
const fs = require("fs");
const path = require("path");
const { Telegram, Markup } = require("telegraf");
const { btnMenu } = require("./../../constants/btn");
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

  static async sendNewsletter(meta, ctx) {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "users.json"), "utf-8"));
    const arreyPromis = [];
    let sucs = 0;
    const error = [];
    data.forEach(({ id }) => {
      if (meta.photo) {
        arreyPromis.push(
          telegram
            .sendPhoto(id, meta.photo[meta.photo.length - 1].file_id, { caption: meta.text })
            .then((res) => (sucs += 1))
            .catch((err) => {
              console.log("err", err);
              return err.code === 403 ? error.push(id) : null;
            })
        );
      } else {
        if (meta.text) {
          arreyPromis.push(
            telegram
              .sendMessage(id, meta.text)
              .then((res) => (sucs += 1))
              .catch((err) => {
                console.log("err", err);
                return err.code === 403 ? error.push(id) : null;
              })
          );
        }
      }
    });

    Promise.all(arreyPromis)
      .catch()
      .finally(() => {
        delUsers(error);
        ctx.reply(
          `Кількість користувачів які отримали повідомлення  - ${sucs}`,
          Markup.keyboard(btnMenu).oneTime().resize().extra()
        );
      });
  }
};

function delUsers(arr) {
  console.log("arr", arr);
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "users.json"), "utf-8"));
  const filterData = data.filter((el) => !arr.includes(el.id));
  fs.writeFileSync(path.resolve(__dirname, "users.json"), JSON.stringify(filterData));
}
