const { Telegram, Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const Extra = require("telegraf/extra");
const { inlineKeyboard } = require("telegraf/markup");
const { genMenu, btnMenu } = require("../../../constants/btn");

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
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\nТип: ${this.type}`;
    telegram.sendMessage(CHAT_ID, text);
  }
}

const FormTatuaz = new WizardScene(
  "formTatuaz",
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
    ctx.reply("Введите вид татуажа", Markup.keyboard().oneTime().resize().extra());
    return ctx.wizard.next();
  },
    (ctx) => {
    ctx.session.infoUser.set("type", ctx.message.text);
    return ctx.scene.leave();
  }
);

FormTatuaz.leave((ctx) => {
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", Markup.keyboard(btnMenu).oneTime().resize().extra());
});

module.exports = FormTatuaz;
