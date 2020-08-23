const { Telegram, Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const { genMenu, btnMenu, btnSendNews } = require("../../../constants/btn");
const UserManagement = require("../../UserManagement");
const keyboardDown = require("../../../helpers/keyboardDown");
const inlineKeyboard = require("../../../helpers/inlineKeyboard");

const { CHAT_ID, TOKEN } = process.env;
class FormHandler {
  constructor() {
      this.text = "";
  }

  set(name, value) {
    this[name] = value;
  }

  async sendData(ctx) {
    await UserManagement.sendNewsletter(this.text, ctx);
    // ctx.wizard.next();
  }

  checkData() {
    return !!this.text
  }
}

const SendNews = new WizardScene(
  "SendNews",
  (ctx) => {
    ctx.session.infoUser = new FormHandler();
    ctx.reply("Введите новость");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.infoUser.set("text", ctx.message.text);
    await ctx.reply(ctx.session.infoUser.text);
    ctx.reply("Подтвердите сообщение", inlineKeyboard(btnSendNews));
    ctx.scene.leave();
  },
  (ctx) => {
    ctx.scene.leave();
  }
);

SendNews.leave(async (ctx) => {
  
});

module.exports = SendNews;
