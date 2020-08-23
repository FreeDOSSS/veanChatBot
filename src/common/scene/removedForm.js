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
  }

  set(name, value) {
    this[name] = value;
  }

  async sendData() {
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\nМесто и размер: ${this.description}`;
    await telegram.sendMessage(CHAT_ID, text);
    if (photo) {
      await telegram.sendPhoto(CHAT_ID, this.photo[this.photo.length - 1].file_id);
    }
  }

  checkData() {
    return !!this.name && !!this.phone && !!this.age && !!this.description ;
  }
}

const RemovedForm = new WizardScene(
  "removedForm",
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
    if (!ctx.session.infoUser.checkData()) return;
    ctx.session.infoUser.set("photo", ctx.message.photo);
    return ctx.scene.leave();
  }
);

RemovedForm.leave((ctx) => {
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", Markup.keyboard(btnMenu).oneTime().resize().extra());
});

module.exports = RemovedForm;
