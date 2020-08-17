const btn = require("../../constants/btn");
const inlineKeyboard = require("../../helpers/inlineKeyboard");
const path = require("path");
const fs = require("fs");
const ListServices = require("../common/lists");
const mammoth = require("mammoth");

module.exports = class PiercingService {
  static async genPiercing(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Пирсинг", inlineKeyboard(btn.genPiercing));
  }

  static async getListStyle(ctx) {
    await ctx.deleteMessage();
    const pathPiercingStyle = path.resolve("assets", "piercing", "style");
    const listStyles = fs.readdirSync(pathPiercingStyle);
    ctx.session.list = new ListServices(
      listStyles.map((text) => ({ text })),
      "text",
      PiercingService.callbackSelectStyle
    );
    return ctx.reply("Выберите стиль", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async callbackSelectStyle(ctx, { text }) {
    ctx.deleteMessage();
    const pathPiercingStyle = path.resolve("assets", "piercing", "style", text);
    const files = fs.readdirSync(pathPiercingStyle);
    const imgs = files.filter((el) => !el.includes(".doc"));
    const text_file = files.find((el) => el.includes(".doc"));
    const dataPhoto = imgs.map((img) => ({
      media: { source: path.resolve(pathPiercingStyle, img) },
      type: "photo",
    }));
    const { value } = await mammoth.extractRawText({
      path: path.resolve(pathPiercingStyle, text_file),
    });
    await ctx.replyWithMediaGroup(dataPhoto);
    return await ctx.reply(value, inlineKeyboard(btn.genPiercing));
  }

  static async mastersCity(ctx) {
    ctx.deleteMessage();
    const pathFolders = path.resolve("assets", "piercing", "masters");
    const folders = fs.readdirSync(pathFolders);
    ctx.session.list = new ListServices(
      folders.map((text) => ({ text })),
      "text",
      PiercingService.callbackMaster
    );
    ctx.reply("Мастера", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async callbackMaster(ctx, { text }) {
    ctx.deleteMessage();
    const pathPiercingStyle = path.resolve("assets", "piercing", "masters", text);
    const files = fs.readdirSync(pathPiercingStyle);
    const imgs = files.filter((el) => !el.includes(".doc"));
    const text_file = files.find((el) => el.includes(".doc"));
    const dataPhoto = imgs.map((img) => ({
      media: { source: path.resolve(pathPiercingStyle, img) },
      type: "photo",
    }));
    const { value } = await mammoth.extractRawText({
      path: path.resolve(pathPiercingStyle, text_file),
    });
    await ctx.replyWithMediaGroup(dataPhoto);
    return await ctx.reply(value, inlineKeyboard(btn.genPiercing));
  }
};
