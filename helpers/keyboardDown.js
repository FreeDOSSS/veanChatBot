const Markup = require("telegraf/markup");
module.exports = (btn) => Markup.keyboard(btn).oneTime().resize().extra();
