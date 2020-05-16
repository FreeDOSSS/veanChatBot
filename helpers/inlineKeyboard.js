const Markup = require("telegraf/markup");

module.exports = (btn) => Markup.inlineKeyboard(btn).extra();
