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
    this.name = null;
    this.phone = null;
    this.age = null;
    this.place = null;
    this.description = null;
    this.photo = null;
    this.city = null;
  }

  set(name, value) {
    this[name] = value;
  }

  async sendData() {
    console.log("this.photo", this.photo);
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\nМесто и размер: ${this.description}\nГород: ${this.city}`;
    await telegram.sendMessage(CHAT_ID, text);
    if (photo) {
      await telegram.sendPhoto(CHAT_ID, this.photo[this.photo.length - 1].file_id);
    }
  }

  checkData() {
    return !!this.name && !!this.phone && !!this.age && !!this.description && !!this.city;
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
    ctx.reply("Введите город")
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("city", ctx.message.text);
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
    console.log("ctx.message", ctx.message);
    ctx.session.infoUser.set("photo", ctx.message.photo);
    return ctx.scene.leave();
  }
);

FormScene.leave((ctx) => {
  if (!ctx.session.infoUser.checkData()) return;
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", Markup.keyboard(btnMenu).oneTime().resize().extra());
});

module.exports = FormScene;
