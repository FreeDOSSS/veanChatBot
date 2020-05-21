const { Telegraf } = require("telegraf");
const Markup = require("telegraf/markup");
const keyboardDown = require("./helpers/keyboardDown");
const inlineKeyboard = require("./helpers/inlineKeyboard");
const { btnMenu, genMenu } = require("./constants/btn");
const session = require("telegraf/session");
const studio = require("./db/studio.json");
console.clear();

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

// TODO FIx Неправельный рендер списка (прпуски городов)

bot.hears("Салоны", (ctx) => {
  // const list = studio.map((el, i) =>
  //   i < 4 ? [Markup.callbackButton(el.city, "studio_info")] : []
  // );
  const list = studio
    .filter((el, i) => i < 4)
    .map((el) => [Markup.callbackButton(el.city, "studio_info")]);

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
  const btn_prev = { text: "<<", callback_data: "prev_studio" };
  const btn_next = { text: ">>", callback_data: "next_studio" };

  let page = ctx.session.studio_page;
  switch (ctx.callbackQuery.data) {
    case "next_studio":
      page = page + 1 < studio.length / 5 ? page + 1 : page;
      break;
    case "prev_studio":
      page = page - 1 > 0 ? page - 1 : page;
      break;
    default:
      return;
  }
  ctx.session.studio_page = page;
  const list = studio
    .filter((el, i) => i > page * 5 && i < page * 5 + 5)
    .map((el) => [Markup.callbackButton(el.city, "studio_info")]);
  list.push([btn_prev, btn_next]);

  //  ctx.editMessageReplyMarkup(inlineKeyboard(list));
  // ctx.editMessageReplyMarkup(Markup.callbackButton("el.city", "studio_info"));
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(list));
});

// Обработка главного меню

bot.action("menu", () => {
  console.log("menu");
});
// bot.action("menu", (ctx) => ctx.reply("Hello"));

module.exports = bot;
