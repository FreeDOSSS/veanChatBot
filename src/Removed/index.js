const inlineKeyboard = require("./../../helpers/inlineKeyboard");
const btn = require("../../constants/btn");
const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");

module.exports = class RemovedService {
  static async get(ctx) {
    await ctx.deleteMessage();
    return ctx.reply("Удаление", inlineKeyboard(btn.genRemoved));
  }

  static async getSessions(ctx) {
    await ctx.deleteMessage();
    return ctx.reply("Кол-во сеансов", inlineKeyboard(btn.sessionsRemoved));
  }

  static async getResultSessions(ctx, type) {
    ctx.deleteMessage();
    const pathFoto = path.resolve("assets", "laser", "result");
    const files = fs.readdirSync(pathFoto);
    const images = files.filter((el) => el.includes(type));

    const dataPhoto = images.map((img) => ({
      media: { source: path.resolve(pathFoto, img) },
      type: "photo",
    }));
    if (dataPhoto.length > 1) {
      await ctx.replyWithMediaGroup(dataPhoto);
    } else {
      await ctx.replyWithPhoto({ source: path.resolve(dataPhoto[0].media.source) });
    }
    return await ctx.reply("Еще варианты", inlineKeyboard(btn.sessionsRemoved));
  }

  static async sendDescription(ctx) {
    mammoth
      .extractRawText({ path: path.resolve("assets", "laser", "text.docx") })
      .then((res) => ctx.reply(res.value, inlineKeyboard(btn.genRemoved)))
      .catch((err) => console.log("err", err));
  }
};
