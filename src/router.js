const { Telegraf, Stage } = require("telegraf");
const Telegram = require("telegraf/telegram");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");

const keyboardDown = require("../helpers/keyboardDown");
const inlineKeyboard = require("../helpers/inlineKeyboard");
const { btnMenu, genMenu } = require("./../constants/btn");
const { studio } = require("./../db");
const scenes = require("./common/scene");

const TatuService = require("./Tatu");
const ListServices = require("./common/lists");
const PirsingService = require("./Piercing");
const PiercingService = require("./Piercing");
const TatuazService = require("./Tatuaz");
const RemovedService = require("./Removed");
const SchoolService = require("./School");
const UserManagement = require("./UserManagement");

const telegram = new Telegram(process.env.TOKEN);
const bot = new Telegraf(process.env.TOKEN);

bot.use(session());

const stage = new Stage(scenes);
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter("HelloForm");
});
bot.action("skip", (ctx) => ctx.wizard.next());

bot.action("gen-tatu", TatuService.gen);
bot.action("tatu-help", TatuService.help);
bot.action("tatu-price", TatuService.getPrice);
bot.action("tatu-style", TatuService.getListStyle);
bot.action("tatu-workExemple", TatuService.mastersCity);
bot.action("tatuForm", (ctx) => ctx.scene.enter("formFirst"));
bot.action("tatuFormIskiz", async (ctx) => {
  await ctx.scene.enter("formFirst");
  await ctx.session.infoUser.set("title", "Заказ эскиза");
});

// Пирсинг
bot.action("genPirsing", PirsingService.genPiercing);
bot.action("prising-style", PirsingService.getListStyle);
bot.action("piercing-konsaltInsalun", (ctx) => ctx.scene.enter("formPiercing"));
bot.action("salons", async (ctx) => {
  await ctx.deleteMessage();
  ctx.session.list = new ListServices(studio, "text", async (ctx, data) => {
    await ctx.deleteMessage();
    await ctx.reply(`Город: ${data.text}\nАдрес: ${data.street}\nГрафик работы: ${data.workTime}`);
    data.phone.forEach((phone, i) => {
      telegram.sendContact(ctx.chat.id, phone, `VeAn ${data.text} #${i + 1}`);
    });
  });

  return ctx.reply("Выберите город", inlineKeyboard(ctx.session.list.renderList()));
});
bot.action("prising-work", PiercingService.mastersCity);

// ========= Tatuaz =========
bot.action("gen-tatuaz", TatuazService.get);
bot.action("tatuaz/brovi", (ctx) => TatuazService.getType(ctx, "брови"));
bot.action("tatuaz/arrow", (ctx) => TatuazService.getType(ctx, "стрелки"));
bot.action("tatuaz/guby", (ctx) => TatuazService.getType(ctx, "губы"));
bot.action("tatuaz/form", (ctx) => ctx.scene.enter("formTatuaz"));

// ========= Removed =========
bot.action("gen-remove", RemovedService.get);
bot.action("removed/result", RemovedService.getSessions);
bot.action("removed/session_1", (ctx) => RemovedService.getResultSessions(ctx, "один сеанс"));
bot.action("removed/session_3", (ctx) => RemovedService.getResultSessions(ctx, "три сеанса"));
bot.action("removed/session_5", (ctx) => RemovedService.getResultSessions(ctx, "пять сеансов"));
bot.action("removed/form", (ctx) => ctx.scene.enter("removedForm"));
bot.action("removed/process", RemovedService.sendDescription);
bot.action("removed/prev", RemovedService.get);

// ========= School =========
bot.action("gen-school", SchoolService.get);
bot.action("school/tatu", (ctx) => SchoolService.getType(ctx, "tatu"));
bot.action("school/tatuaz", (ctx) => SchoolService.getType(ctx, "tatuaz"));
bot.action("school/piercing", (ctx) => SchoolService.getType(ctx, "piercing"));

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
bot.hears("Я не нашёл ответа на вопрос", (ctx) => ctx.scene.enter("commonForm"));
// Newsletter
bot.command("sendNews", (ctx) => {
  ctx.scene.enter("SendNews");
});
bot.action("sendNews/send", async (ctx) => {
  console.dir(ctx.session.infoUser);
  await ctx.session.infoUser.sendData(ctx);
  ctx.reply("sd");
  await ctx.reply(`${ctx.from.first_name}, что тебя интересует?`, inlineKeyboard(genMenu));
});
bot.action("sendNews/cancel", async (ctx) => {
  await ctx.reply("Отмена новости");
  delete ctx.session.infoUser;
  await ctx.reply(`${ctx.from.first_name}, что тебя интересует?`, inlineKeyboard(genMenu));
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  ctx.reply("Упс(((\nЧто-то пошло не так, перезапусти меня)");
});
module.exports = { bot, telegram };
