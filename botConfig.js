const { Telegraf } = require("telegraf");
const Markup = require("telegraf/markup");
const keyboardDown = require("./helpers/keyboardDown");
const { btnMenu } = require("./constants/btn");

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Хей, мы Vean tattoo ❤️\nБренд основан в 2011 году.\nМы несём тату в массы и получаем от этого удовольствие.\nПрисоединяйся к нам!\nЧто тебя интересует ?`,
    keyboardDown(btnMenu)
  )
);

// bot.on("message", (ctx) => {
//   return ctx.reply(
//     "random ",
//     Markup.inlineKeyboard([Markup.callbackButton("Test", "test")]).extra() // Work
//   );
// });

bot.action("menu", () => {
  console.log("menu");
});
// bot.action("menu", (ctx) => ctx.reply("Hello"));

module.exports = bot;
