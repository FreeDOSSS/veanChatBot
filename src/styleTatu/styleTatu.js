const path = require("path");
const Extra = require("telegraf/extra");
const fs = require("fs");
const inlineKeyboard = require("./../../helpers/inlineKeyboard");
const { genTatu } = require("./../../constants/btn");

const sendStyle = (ctx, name) => {
  const dataImage = path.resolve("assets", "tatu", "style", name, "images");

  const img = fs.readdirSync(dataImage);

  const data = img.map((foto) => ({
    media: { source: path.resolve(dataImage, foto) },
    type: "photo",
  }));

  const text = fs.readFileSync(
    path.resolve("assets", "tatu", "style", name, "text", "text.txt"),
    "utf-8"
  );

  ctx.reply(text);

  ctx.replyWithMediaGroup(data).then((res) => {
    ctx.reply("Что дальше?", inlineKeyboard(genTatu));
  });
};

module.exports = sendStyle;
