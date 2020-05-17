const { Telegraf } = require("telegraf");
const Markup = require("telegraf/markup");
const keyboardDown = require("./helpers/keyboardDown");
const inlineKeyboard = require("./helpers/inlineKeyboard");
const { btnMenu, genMenu } = require("./constants/btn");
const studio = require("./db/studio.json");

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `Хей, мы Vean tattoo ❤️\nБренд основан в 2011 году.\nМы несём тату в массы и получаем от этого удовольствие.\nПрисоединяйся к нам!`,
    keyboardDown(btnMenu)
  );
  ctx.reply("Что тебя интересует ?", inlineKeyboard(genMenu));
});

// Обработка нижнего меню

bot.hears("Меню", (ctx) => {
  return ctx.reply("Что тебя интересует ?", inlineKeyboard(genMenu));
});

bot.hears("Салоны", (ctx) => {
  ctx.reply(
    "Выбирите город",
    inlineKeyboard(
      // [Markup.callbackButton("Тату", "studio_info")]
      studio.map((el) => [Markup.callbackButton(el.city, "studio_info")])
    )
  );
});

// Обработка главного меню

bot.action("menu", () => {
  console.log("menu");
});
// bot.action("menu", (ctx) => ctx.reply("Hello"));

module.exports = bot;
