const inlineKeyboard = require("../../helpers/inlineKeyboard");
const btn = require("../../constants/btn");
const path = require("path");
const fs = require("fs");

module.exports = class SchoolService {
  static async get(ctx) {
    ctx.deleteMessage();
    return ctx.reply("Обучение", inlineKeyboard(btn.genSchool));
  }

  static async getType(ctx, type) {
    ctx.deleteMessage();
    const result = fs.readFileSync(path.resolve("assets", "school", `${type}.txt`), "utf-8");
    return ctx.reply(result, inlineKeyboard(btn.genSchool));
  }
};
