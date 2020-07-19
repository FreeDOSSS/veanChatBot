const WizardScene = require("telegraf/scenes/wizard");

class FormHandler {
  constructor() {
    this.name = "";
    this.phone = "";
    this.age = "";
    this.place = "";
    this.description = "";
    this.photo = "";
  }

  set(name, value) {
    this[name] = value;
  }

  sendData() {}
}

const FormScene = new WizardScene(
  "formFirst",
  (ctx) => {
    ctx.session.infoUser = new FormHandler();
    ctx.reply("Введите имя");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("name", ctx.message.text);
    ctx.reply("Введите возраст");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("age", ctx.message.text);
    ctx.reply("Введите номер");
    // TODO Запросить номер
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("phone", ctx.message.text);
    ctx.reply("Введите место и размер тату");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("photo", ctx.message.photo);
    return ctx.scene.leave();
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.infoUser.set("place", ctx.message.text);
    // return ctx.wizard.next();
  }
);
// return ctx.scene.leave();

module.exports = FormScene;
