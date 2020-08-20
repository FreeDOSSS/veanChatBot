const btn = require("../../constants/btn");
const inlineKeyboard = require("../../helpers/inlineKeyboard");
const path = require("path");
const fs = require("fs");

module.exports = class TatuazService {
  static async get(ctx) {
    ctx.deleteMessage();
    return ctx.reply("Татуаж", inlineKeyboard(btn.genTatuaz));
  }

  static async getType(ctx, folder) {
    ctx.deleteMessage();
    const pathTatuaz = path.resolve("assets", 'tatuaz', folder);
    const files = fs.readdirSync(pathTatuaz);
    const images = files.filter((el) => !el.includes(".txt"));

    const txt_files = files.find((el) => el.includes(".txt"));

    const dataPhoto = images.map((img) => ({
      media: { source: path.resolve(pathTatuaz, img) },
      type: "photo",
    }));

    const text = fs.readFileSync(path.resolve(pathTatuaz, txt_files), 'utf-8');

    await ctx.replyWithMediaGroup(dataPhoto);
    
    return await ctx.reply(text, inlineKeyboard(btn.genTatuaz));
  }

  
};
