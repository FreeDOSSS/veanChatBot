const btn = require("./../../constants/btn");
const inlineKeyboard = require("./../../helpers/inlineKeyboard");
const path = require("path");
const fs = require("fs");
const ListServices = require("../common/lists");
const mammoth = require("mammoth");

module.exports = class PircingService {
  static async genPircing(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Пирсинг", inlineKeyboard(btn.genPircing));
  }

  static async getListStyle(ctx) {
    const pathPiringStyle = path.resolve("assets", "pirsing", "style");
    const listStyles = fs.readdirSync(pathPiringStyle);
    ctx.session.list = new ListServices(
      listStyles.map((text) => ({ text })),
      "text",
      PircingService.callbackSelectStyle
    );
    return ctx.reply("Выберите стиль", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async callbackSelectStyle(ctx, { text }) {
    const pathPiringStyle = path.resolve("assets", "pirsing", "style", text);
    const files = fs.readdirSync(pathPiringStyle);
    const imgs = files.filter((el) => !el.includes(".doc"));
    const text_file = files.find((el) => el.includes(".doc"));
    const dataPhoto = imgs.map((img) => ({
      media: { source: path.resolve(pathPiringStyle, img) },
      type: "photo",
    }));
    const { value } = await mammoth.extractRawText({
      path: path.resolve(pathPiringStyle, text_file),
    });
    await ctx.replyWithMediaGroup(dataPhoto);
    return await ctx.reply(value, inlineKeyboard(btn.genPircing));
  }

  static async help(ctx) {}

  static async getPrice(ctx) {}

  static async mastersCity(ctx) {}
};
