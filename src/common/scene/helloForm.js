const { Telegram, Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const Extra = require("telegraf/extra");
const { genMenu, btnMenu } = require("../../../constants/btn");
const UserManagement = require("../../UserManagement");
const keyboardDown = require("../../../helpers/keyboardDown");
const inlineKeyboard = require("../../../helpers/inlineKeyboard");

const { CHAT_ID, TOKEN } = process.env;

const telegram = new Telegram(TOKEN);
class FormHandler {
  constructor() {
    this.name = null;
    this.phone = null;
    this.userID = null;
  }

  set(name, value) {
    this[name] = value;
  }

  sendData() {
    UserManagement.saveNewUser({ name: this.name, phone: this.phone, id: this.userID });
  }
}

const HelloForm = new WizardScene(
  "HelloForm",
  (ctx) => {
    ctx.session.infoUser = new FormHandler();
    ctx.session.infoUser.set("userID", ctx.from.id);
    ctx.reply("Представьтесь");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("name", ctx.message.text);
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

HelloForm.leave(async (ctx) => {
  ctx.session.infoUser.sendData();
  await ctx.reply(
    `Хей, мы Vean tattoo ❤️\nБренд основан в 2011 году.\nМы несём тату в массы и получаем от этого удовольствие.\nПрисоединяйся к нам!`,
    keyboardDown(btnMenu)
  );
  await ctx.reply(`${ctx.from.first_name}, что тебя интересует?`, inlineKeyboard(genMenu));
});

module.exports = HelloForm;
