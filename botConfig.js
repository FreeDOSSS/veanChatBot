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

// Листание студий
const btn_next_studio = { text: ">>", callback_data: "next_studio" };
const btn_prev_studio = { text: "<<", callback_data: "prev_studio" };
bot.hears("Салоны", (ctx) => {
  const list = studio
    .filter((el, i) => i < 4)
    .map((el) => [Markup.callbackButton(el.city, "studio_info")]);

  list.push([btn_prev_studio, btn_next_studio]);

  ctx.session.studio_page = 0;
  return ctx.reply("Выбирите город", inlineKeyboard(list));
});

const listStudioPage = (page) => {
  const arr = studio
    .filter((el, i) => i >= page * 4 && i < page * 4 + 4)
    // .map((el) => [Markup.callbackButton(el.city, "studio_info")]);
    .map((el) => [{ text: el.city, callback_data: `studio_info.${el.city}` }]);
  arr.push([btn_prev_studio, btn_next_studio]);
  return arr;
};

bot.action("next_studio", (ctx) => {
  let page = ctx.session.studio_page;
  page = page + 1 <= studio.length / 4 ? page + 1 : page;

  ctx.session.studio_page = page;
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(listStudioPage(page)));
});
bot.action("prev_studio", (ctx) => {
  let page = ctx.session.studio_page;
  page = page - 1 >= 0 ? page - 1 : page;

  ctx.session.studio_page = page;
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(listStudioPage(page)));
});

// bot.on("callback_query", (ctx) => {
//   let page = ctx.session.studio_page;
//   // console.log("page", page);
//   switch (ctx.callbackQuery.data) {
//     case "next_studio":
//       page = page + 1 <= studio.length / 4 ? page + 1 : page;
//       break;
//     case "prev_studio":
//       page = page - 1 >= 0 ? page - 1 : page;
//       break;
//     default:
//       return;
//   }

//   const list = studio
//     .filter((el, i) => i >= page * 4 && i < page * 4 + 4)
//     .map((el) => [Markup.callbackButton(el.city, "studio_info")]);
//   list.push([btn_prev, btn_next]);

//   ctx.session.studio_page = page;

//   //  ctx.editMessageReplyMarkup(inlineKeyboard(list));
//   // ctx.editMessageReplyMarkup(Markup.callbackButton("el.city", "studio_info"));
//   ctx.editMessageReplyMarkup(Markup.inlineKeyboard(list));
// });

// обработка инфы студии

bot.action("studio_info", (ctx) => {
  console.log("ctx", ctx.callbackQuery);
});

// Обработка главного меню

bot.action("menu", () => {
  console.log("menu");
});
// bot.action("menu", (ctx) => ctx.reply("Hello"));

module.exports = bot;

// TODO листать по текущий странице

/*
0 1 2 3 | 0
4 5 6 7 | 1
8 9 10 11 | 2
*/
