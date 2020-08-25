const { Telegram, Markup } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const { genMenu, btnMenu, btnSendNews } = require("../../../constants/btn");
const UserManagement = require("../../UserManagement");
const keyboardDown = require("../../../helpers/keyboardDown");
const inlineKeyboard = require("../../../helpers/inlineKeyboard");

const { CHAT_ID, TOKEN } = process.env;
class FormHandler {
  constructor() {
    this.text = null;
    this.photo = null;
  }

  set(name, value) {
    this[name] = value;
  }

  async sendData(ctx) {
    await UserManagement.sendNewsletter({ text: this.text, photo: this.photo }, ctx);
    // ctx.wizard.next();
  }

  checkData() {
    return !!this.text;
  }
}

const SendNews = new WizardScene(
  "SendNews",
  (ctx) => {
    ctx.session.infoUser = new FormHandler();
    ctx.reply(
      "Введите новость",
      Markup.keyboard([Markup.callbackButton("Пропустить", "skip")])
        .oneTime()
        .resize()
        .extra()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.session.infoUser.set("text", ctx.message.text.replace("Пропустить", "") || "");
    ctx.reply(
      "Добавьте фото",
      Markup.keyboard([Markup.callbackButton("Пропустить", "skip")])
        .oneTime()
        .resize()
        .extra()
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.infoUser.photo = ctx.message.photo;
    if (ctx.message.photo) {
      await ctx.replyWithPhoto(ctx.message.photo[ctx.message.photo.length - 1].file_id, {
        caption: ctx.session.infoUser.text || "",
      });
    } else {
      if (ctx.session.infoUser.text) {
        await ctx.reply(ctx.session.infoUser.text);
      }
    }
    ctx.reply("Подтвердите сообщение", inlineKeyboard(btnSendNews));
    ctx.scene.leave();
  },
  (ctx) => {
    ctx.scene.leave();
  }
);

SendNews.leave(async (ctx) => {});

module.exports = SendNews;
