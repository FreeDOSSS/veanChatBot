const { Telegraf, Stage } = require("telegraf");
const Telegram = require("telegraf/telegram");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");

const keyboardDown = require("../helpers/keyboardDown");
const inlineKeyboard = require("../helpers/inlineKeyboard");
const { btnMenu, genMenu } = require("./../constants/btn");
const { studio } = require("./../db");
const scenes = require("./common/scene");
// const sendStyle = require("./styleTatu/styleTatu");

const TatuService = require("./Tatu");
const ListServices = require("./common/lists");
const PirsingService = require("./Piercing");

const telegram = new Telegram(process.env.TOKEN);
const bot = new Telegraf(process.env.TOKEN);

bot.use(session());

const stage = new Stage(scenes);
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply(
    `Хей, мы Vean tattoo ❤️\nБренд основан в 2011 году.\nМы несём тату в массы и получаем от этого удовольствие.\nПрисоединяйся к нам!`,
    keyboardDown(btnMenu)
  );
  ctx.reply(`${ctx.from.first_name}, что тебя интересует ?`, inlineKeyboard(genMenu));
});
bot.action("skip", (ctx) => ctx.wizard.next());

bot.action("gen-tatu", TatuService.gen);
bot.action("tatu-help", TatuService.help);
bot.action("tatu-price", TatuService.getPrice);
bot.action("tatu-style", TatuService.getListStyle);
bot.action("tatu-workExemple", TatuService.mastersCity);
bot.action("tatuForm", (ctx) => ctx.scene.enter("formFirst"));

// Пирсинг
bot.action("genPirsing", PirsingService.genPiercing);
bot.action("prising-style", PirsingService.getListStyle);
bot.action("salons", async (ctx) => {
  await ctx.deleteMessage();
  ctx.session.list = new ListServices(studio, "text", async (ctx, data) => {
    await ctx.deleteMessage();
    await ctx.reply(`Город: ${data.text}\nАдрес: ${data.street}\nГрафик работы: ${data.workTime}`);
    data.phone.forEach((phone, i) => {
      telegram.sendContact(ctx.chat.id, phone, `VeAn ${data.text} #${i + 1}`);
    });
  });

  return ctx.reply("Выбирите город", inlineKeyboard(ctx.session.list.renderList()));
});
// bot.action("");

// Управление списками
bot.action("prev_list", (ctx) => {
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(ctx.session.list.prevPage()));
});
bot.action("next_list", (ctx) =>
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(ctx.session.list.nextPage()))
);
bot.action(new RegExp("select_item/"), (ctx) => ctx.session.list.selectItem(ctx));
// ==========

// Нижнее меню
bot.hears("Меню", (ctx) => {
  return ctx.reply("Что тебя интересует ?", inlineKeyboard(genMenu));
});

bot.hears("Салоны", async (ctx) => {
  await ctx.deleteMessage();
  ctx.session.list = new ListServices(studio, "text", async (ctx, data) => {
    await ctx.deleteMessage();
    await ctx.reply(`Город: ${data.text}\nАдрес: ${data.street}\nГрафик работы: ${data.workTime}`);
    data.phone.forEach((phone, i) => {
      telegram.sendContact(ctx.chat.id, phone, `VeAn ${data.text} #${i + 1}`);
    });
  });

  return ctx.reply("Выбирите город", inlineKeyboard(ctx.session.list.renderList()));
});
// ==========
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  ctx.reply("Упс(((\nЧто-то пошло не так, перезапусти меня)");
});
module.exports = { bot, telegram };
