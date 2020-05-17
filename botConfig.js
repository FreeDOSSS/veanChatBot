const { Telegraf } = require("telegraf");
const Markup = require("telegraf/markup");
const keyboardDown = require("./helpers/keyboardDown");
const inlineKeyboard = require("./helpers/inlineKeyboard");
const { btnMenu, genMenu } = require("./constants/btn");
const session = require("telegraf/session");
const studio = require("./db/studio.json");

const bot = new Telegraf(process.env.TOKEN);
bot.use(session());

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
  const list = studio.map((el, i) =>
    i < 5 ? [Markup.callbackButton(el.city, "studio_info")] : []
  );

  list.push([
    { text: "<<", callback_data: "prev_studio" },
    { text: ">>", callback_data: "next_studio" },
  ]);

  ctx.session.studio_page = 1;
  return ctx.reply(
    "Выбирите город",
    // Markup.inlineKeyboard([{ text: "test", callback_data: "test" }]).extra()
    inlineKeyboard(list)
  );
});

bot.on("callback_query", (ctx) => {
  console.log("studio.length", studio.length / 5);
  const btn_prev = { text: "<<", callback_data: "prev_studio" };
  const btn_next = { text: ">>", callback_data: "next_studio" };
  switch (ctx.callbackQuery.data) {
    case "next_page":
      ctx.session.studio_page =
        ctx.session.studio_page + 1 < studio.length / 5
          ? ctx.session.studio_page + 1
          : "";
      // btn_next.text = " ";
      // btn_ne
      break;
    case "prev_page":
      break;
  }
  console.log("ctx.callback_data", ctx.callbackQuery.data);
});

// Обработка главного меню

bot.action("menu", () => {
  console.log("menu");
});
// bot.action("menu", (ctx) => ctx.reply("Hello"));

module.exports = bot;
