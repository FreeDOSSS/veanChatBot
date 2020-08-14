const { Telegram } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const Extra = require("telegraf/extra");
const { inlineKeyboard } = require("telegraf/markup");
const { genMenu, btnMenu } = require("../../../constants/btn");
const Markup = require("telegraf/markup");

const { CHAT_ID, TOKEN } = process.env;

const telegram = new Telegram(TOKEN);
class FormHandler {
  constructor() {
    this.name = "";
    this.phone = "";
    this.age = "";
    this.place = "";
    this.description = "";
    this.photo = "";
  }

  set(name, value) {
    this[name] = value;
  }

  sendData() {
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\nМесто и размер: ${this.description}`;
    console.log("CHAT_ID", CHAT_ID);
    telegram.sendMessage(CHAT_ID, text);
  }
}

const FormScene = new WizardScene(
  "formFirst",
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
    ctx.reply("Введите место и размер тату", Markup.keyboard().oneTime().resize().extra());
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("description", ctx.message.text);
    ctx.reply(
      "Добавьте одно фото",
      Markup.keyboard([Markup.callbackButton("Пропустить", "skip")])
        .oneTime()
        .resize()
        .extra()
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("photo", ctx.message.photo);
    return ctx.scene.leave();
  }
);

FormScene.leave((ctx) => {
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", Markup.keyboard(btnMenu).oneTime().resize().extra());
});

module.exports = FormScene;
