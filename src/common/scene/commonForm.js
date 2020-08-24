const { Telegram, Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const Extra = require("telegraf/extra");
const { inlineKeyboard } = require("telegraf/markup");
const { genMenu, btnMenu } = require("../../../constants/btn");

const { CHAT_ID, TOKEN } = process.env;

const telegram = new Telegram(TOKEN);
class FormHandler {
  constructor() {
    this.name = null;
    this.phone = null;
    this.age = null;
    this.text = null;
    this.city = null;
  }

  set(name, value) {
    this[name] = value;
  }

  sendData() {
    const text = `Имя: ${this.name}\nТелефон: ${this.phone}\nВозраст:  ${this.age}\nТекст: ${this.text}\nГород: ${this.city}`;
    telegram.sendMessage(CHAT_ID, text).catch(err => console.log('err', err));
  }

  checkData() {
    return !!this.name && !!this.phone && !!this.age && !!this.text;
  }
}

const CommonForm = new WizardScene(
  "commonForm",
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
    ctx.reply("Введите город");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("city", ctx.message.text);
    ctx.reply("Введите комментарий");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("text", ctx.message.text);
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
    return ctx.scene.leave();
  }
);

CommonForm.leave((ctx) => {
  if (!ctx.session.infoUser.checkData()) return;
  ctx.session.infoUser.sendData();
  ctx.reply("Данные успешно отправлены", Markup.keyboard(btnMenu).oneTime().resize().extra());
});

module.exports = CommonForm;
