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

const genTatu = [
  [Markup.callbackButton("У меня есть идея, эскиз", "tatu-idia")],
  [
    Markup.callbackButton(
      "Нужна помощь!  Хочу узнать больше о тату!",
      "tatu-help"
    ),
  ],
];

const helpTatu = [
  [Markup.callbackButton("Стили тату", "tatu-style")],
  [Markup.callbackButton("Стоимость сеанса", "tatu-price")],
  [Markup.callbackButton("Работы мастеров", "tatu-workExemple")],
  [
    Markup.callbackButton(
      "Бесплатная консультация в салоне",
      "tatu-konsaltInsalun"
    ),
  ],
];

const styleTatu = [
  [Markup.callbackButton("Я нашел то что нужно", "form1")],
  [Markup.callbackButton("", "tatu-help")],
];

module.exports = { btnMenu, genMenu };
