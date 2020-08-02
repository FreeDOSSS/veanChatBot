const btn = require("./../../constants/btn");
const inlineKeyboard = require("./../../helpers/inlineKeyboard");
const path = require("path");
const fs = require("fs");
const ListServices = require("../common/lists");
const mammoth = require("mammoth");
module.exports = class TatuService {
  static async gen(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Тату", inlineKeyboard(btn.genTatu));
  }

  static async help(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply("Чем помочь?", inlineKeyboard(btn.helpTatu));
  }

  static async getPrice(ctx) {
    await ctx.deleteMessage();
    return await ctx.reply(
      "Минимальная цена тату 600-700 грн. Далее все зависит от места, размера и стиля тату. Также есть мастера, которые берут оплату за сеанс либо за час работы. Чтобы узнать точную стоимость - опишите мастеру свою идею и предоставьте фото работ в понравившийся стилистике.",
      inlineKeyboard(btn.beckTatu)
    );
  }

  static async getListStyle(ctx) {
    await ctx.deleteMessage();
    const listNamePath = path.resolve("assets", "tatu", "style");
    const listName = fs.readdirSync(listNamePath).map((text) => ({ text }));

    ctx.session.list = new ListServices(listName, "text", async (ctx, { text }) => {
      const imgList = fs.readdirSync(path.resolve(listNamePath, text, "images"));

      const dataPhoto = imgList.map((img) => ({
        media: { source: path.resolve(listNamePath, text, "images", img) },
        type: "photo",
      }));
      const message = fs.readFileSync(
        path.resolve(listNamePath, text, "text", "text.txt"),
        "utf-8"
      );
      await ctx.reply(message);
      await ctx.replyWithMediaGroup(dataPhoto);

      return await ctx.reply("Что дальше?", inlineKeyboard(btn.genTatu));
    });

    return ctx.reply("Выберите стиль  ", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async mastersCity(ctx) {
    ctx.deleteMessage();
    const basicPath = path.resolve("assets", "tatu", "tatu_master");
    const listCity = fs.readdirSync(basicPath).map((text) => ({ text }));

    ctx.session.list = new ListServices(listCity, "text", TatuService.callbackMasterCity);
    ctx.reply("Откуда Вы?", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async callbackMasterCity(ctx, { text }) {
    ctx.deleteMessage();
    const basicPath = path.resolve("assets", "tatu", "tatu_master", text);
    ctx.session.master_city = text;
    const listMasters = fs.readdirSync(basicPath).map((text) => ({ text }));

    ctx.session.list = new ListServices(listMasters, "text", TatuService.callbackMaster);
    ctx.reply("Выберете мастера", inlineKeyboard(ctx.session.list.renderList()));
  }

  static async callbackMaster(ctx, { text }) {
    const path_master = path.resolve(
      "assets",
      "tatu",
      "tatu_master",
      ctx.session.master_city,
      text
    );

    const files = fs.readdirSync(path_master);

    const text_file = files.find((el) => el.includes(".doc"));

    const images = files.filter((el) => !el.includes(".doc"));
    const dataPhoto = images.map((img) => ({
      media: { source: path.resolve(path_master, img) },
      type: "photo",
    }));
    await ctx.replyWithMediaGroup(dataPhoto);
    mammoth
      .extractRawText({ path: path.resolve(path_master, text_file) })
      .then((res) => {
        ctx.reply(res.value, inlineKeyboard(btn.beckTatu));
      })
      .catch((err) => console.log("err", err));
  }
};
