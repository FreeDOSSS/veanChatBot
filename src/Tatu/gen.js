const { genTatu } = require("./../../constants/btn");
const inlineKeyboard = require("./../../helpers/inlineKeyboard");

const gen = async (ctx) => {
  await ctx.deleteMessage();
  return await ctx.reply("Тату", inlineKeyboard(genTatu));
};

module.exports = gen;
