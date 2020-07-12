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

  static async getPrice(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply(
      "Минимальная цена тату 600-700 грн. Далее все зависит от места, размера и стиля тату. Также есть мастера, которые берут оплату за сеанс либо за час работы. Чтобы узнать точную стоимость - опишите мастеру свою идею и предоставьте фото работ в понравившийся стилистике.",
      inlineKeyboard(btn.beckTatu)
    );
  }
};
