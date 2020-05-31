const { Telegraf } = require("telegraf");
const Telegram = require("telegraf/telegram");
const Markup = require("telegraf/markup");
const keyboardDown = require("./helpers/keyboardDown");
const inlineKeyboard = require("./helpers/inlineKeyboard");
const {
  btnMenu,
  genMenu,
  genTatu,
  helpTatu,
  beckTatu,
  styleList,
} = require("./constants/btn");
const session = require("telegraf/session");
const studio = require("./db/studio.json");
const sendStyle = require("./src/styleTatu/styleTatu");

const telegram = new Telegram(process.env.TOKEN);
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

// <Листание студий>
const btn_next_studio = { text: ">>", callback_data: "next_studio" };
const btn_prev_studio = { text: "<<", callback_data: "prev_studio" };
bot.hears("Салоны", (ctx) => {
  const list = studio
    .filter((el, i) => i < 4)
    .map((el) => [Markup.callbackButton(el.city, `studio_info/${el.city}`)]);

  list.push([btn_prev_studio, btn_next_studio]);

  ctx.session.studio_page = 0;
  return ctx.reply("Выбирите город", inlineKeyboard(list));
});

const listStudioPage = (page) => {
  const arr = studio
    .filter((el, i) => i >= page * 4 && i < page * 4 + 4)
    .map((el) => [{ text: el.city, callback_data: `studio_info/${el.city}` }]);
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

bot.on("callback_query", (ctx, next) => {
  if (!ctx.callbackQuery.data.includes("studio_info")) return next();

  const name = ctx.callbackQuery.data.split("/")[1];

  const city = studio.find((el) => el.city === name);

  ctx.reply(
    `Город: ${city.city}\nАдрес: ${city.street} \nГрафик работы: ${city.workTime}`
  );

  city.phone.forEach((phone, i) => {
    telegram.sendContact(ctx.chat.id, phone, `VeAn ${city.city} #${i + 1}`);
  });
});
//  </ Листание студий>

// Ветка тату
bot.action("gen-tatu", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("Тату", inlineKeyboard(genTatu));
});

bot.action("tatu-help", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("Чем помочь?", inlineKeyboard(helpTatu));
});

bot.action("tatu-price", (ctx) =>
  ctx.reply(
    "Минимальная цена тату 600-700 грн. Далее все зависит от места, размера и стиля тату. Также есть мастера, которые берут оплату за сеанс либо за час работы. Чтобы узнать точную стоимость - опишите мастеру свою идею и предоставьте фото работ в понравившийся стилистике.",
    inlineKeyboard(beckTatu)
  )
);

bot.action("tatu-style", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("Стили тату", inlineKeyboard(styleList));
});

bot.action("treshpolka", (ctx) => sendStyle(ctx, "trashpolka"));
bot.action("linework", (ctx) => sendStyle(ctx, "linework"));
bot.action("baclandgrey", (ctx) => sendStyle(ctx, "baclandgrey"));
bot.action("newschool", (ctx) => sendStyle(ctx, "newschool"));
bot.action("oldschool", (ctx) => sendStyle(ctx, "oldschool"));
bot.action("realizm", (ctx) => sendStyle(ctx, "realizm"));
bot.action("blackwork", (ctx) => sendStyle(ctx, "blackwork"));
bot.action("japonia", (ctx) => sendStyle(ctx, "japonia"));
bot.action("leterang", (ctx) => sendStyle(ctx, "leterang"));
bot.action("arkvarel", (ctx) => sendStyle(ctx, "arkvarel"));
bot.action("dotwork", (ctx) => sendStyle(ctx, "dotwork"));
// Style end

bot.action("tatu-workExemple", (ctx) => {
  const list = studio
    .filter((el, i) => i < 4)
    .map((el) => [Markup.callbackButton(el.city, `work_exm/${el.city}`)]);

  list.push([btn_prev_studio, btn_next_studio]);

  ctx.session.studio_page = 0;
  return ctx.reply("Выбирите город", inlineKeyboard(list));
});

bot.on("callback_query", (ctx, next) => {
  if (!ctx.callbackQuery.data.includes("work_exm")) return next();

  const name = ctx.callbackQuery.data.split("/")[1];

  // const city = studio.find((el) => el.city === name);

  // ctx.reply(
  //   `Город: ${city.city}\nАдрес: ${city.street} \nГрафик работы: ${city.workTime}`
  // );

  // city.phone.forEach((phone, i) => {
  //   telegram.sendContact(ctx.chat.id, phone, `VeAn ${city.city} #${i + 1}`);
  // });
});

module.exports = bot;
