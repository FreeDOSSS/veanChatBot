const btn = require("./../../constants/btn");
const inlineKeyboard = require("./../../helpers/inlineKeyboard");

module.exports = class TatuService {
  static async gen(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Тату", inlineKeyboard(btn.genTatu));
  }

  static async help(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Чем помочь?", inlineKeyboard(btn.helpTatu));
  }
};
