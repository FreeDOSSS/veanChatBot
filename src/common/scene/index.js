const FormScene = require("./form");
const FormPiercing = require("./pircingForm");
const FormTatuaz = require("./tatuazForm");
const RemovedForm = require("./removedForm");
const CommonForm = require("./commonForm");
const HelloForm = require("./helloForm");
const SendNews = require("./SendNews");
const { genMenu } = require("../../../constants/btn");
const inlineKeyboard = require("../../../helpers/inlineKeyboard");

const Scenes = [
  FormScene,
  FormPiercing,
  FormTatuaz,
  RemovedForm,
  CommonForm,
  HelloForm,
  SendNews,
].map((el) =>
  el.hears("Меню", async (ctx) => {
    await ctx.reply("Отмена", inlineKeyboard(genMenu));
    await ctx.scene.leave();
  })
);

module.exports = Scenes;
