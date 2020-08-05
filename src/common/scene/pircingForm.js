const { Telegram } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const Extra = require("telegraf/extra");
const { inlineKeyboard } = require("telegraf/markup");
const { genMenu } = require("../../../constants/btn");

const { CHAT_ID, TOKEN } = process.env;

const telegram = new Telegram(TOKEN);
class FormHandler {
  constructor() {
    this.name = "";
    this.phone = "";
    this.age = "";
    this.type = "";
  }

  set(name, value) {
    this[name] = value;
  }

  sendData() {
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\Тип: ${this.types}`;
    console.log("CHAT_ID", CHAT_ID);
    telegram.sendMessage(CHAT_ID, text);
  }
}

const FormPircing = new WizardScene(
  "formPircing",
  (ctx) => {
    ctx.session.infoUser = new FormHandler();
    ctx.reply("Введите имя");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("name", ctx.message.text);
    ctx.reply("Введите возраст");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("age", ctx.message.text);
    ctx.reply(
      "Введите номер",
      Extra.markup((markup) => {
        return markup.resize().keyboard([markup.contactRequestButton("Отправить номер телефона")]);
      })
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("phone", ctx.message.text || ctx.message.contact.phone_number);
    ctx.reply("Введите тип пирсинга");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("type", ctx.message.photo);
    return ctx.scene.leave();
  }
);

FormPircing.leave((ctx) => {
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", inlineKeyboard(genMenu));
});

module.exports = FormPircing;
