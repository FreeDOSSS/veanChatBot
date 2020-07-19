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

bot.action("gen-tatu", TatuService.gen);
bot.action("tatu-help", TatuService.help);
bot.action("tatu-price", TatuService.getPrice);

// Управление списками
bot.action("prev_list", (ctx) => {
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(ctx.session.list.prevPage()));
});
bot.action("next_list", (ctx) =>
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard(ctx.session.list.nextPage()))
);
bot.action(new RegExp("select_item/"), (ctx) => ctx.session.list.selectItem(ctx));

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

bot.command("test", (ctx) => ctx.scene.enter("formFirst"));
bot.command("photo", (ctx) => {
  const arrPhoto = ctx.session.infoUser.photo;
  console.log(
    "arrPhoto[arrPhoto.length - 1].file_id",
    arrPhoto[arrPhoto.length - 1].file_unique_id
  );
  // TODO Отправить данные
  ctx.replyWithPhoto(arrPhoto[arrPhoto.length - 1].file_id);
});

// bot.action("");

/*

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
*/
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});
module.exports = bot;
