const Markup = require("telegraf/markup");
const btnMenu = [["Меню"], ["Салоны"], ["Запись на сеанс"]];

const genMenu = [
  [Markup.callbackButton("Тату", "gen-tatu")],
  [Markup.callbackButton("Пирсинг", "gen-persing")],
  [Markup.callbackButton("Татуаж", "gen-tatuj")],
  [Markup.callbackButton("Удаление", "gen-remove")],
  [Markup.callbackButton("VeAn SCHOOL", "gen-school")],
  [
    {
      text: "VeAn Магазин",
      url: "https://vean-shop.com",
    },
  ],
];

module.exports = { btnMenu, genMenu };
