const Markup = require("telegraf/markup");
const btnMenu = [["Меню"], ["Салоны"], ["Запись на сеанс"]];

const genMenu = [
  [Markup.callbackButton("Тату", "gen-tatu")],
  [Markup.callbackButton("Пирсинг", "genPirsing")],
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
  [Markup.callbackButton("У меня есть идея, эскиз", "tatuForm")],
  [Markup.callbackButton("Нужна помощь!  Хочу узнать больше о тату!", "tatu-help")],
];

const helpTatu = [
  [Markup.callbackButton("Стили тату", "tatu-style")],
  [Markup.callbackButton("Стоимость сеанса", "tatu-price")],
  [Markup.callbackButton("Работы мастеров", "tatu-workExemple")],
  [Markup.callbackButton("Бесплатная консультация в салоне", "tatuForm")],
];

const beckTatu = [
  [Markup.callbackButton("Я нашел то что нужно", "tatuForm")],
  [Markup.callbackButton("Назад", "tatu-help")],
];

const genPiercing = [
  [Markup.callbackButton("Я знаю чего хочу", "piercing-konsaltInsalun")],
  [Markup.callbackButton("Виды пирсинга", "prising-style")],
  [Markup.callbackButton("Работы мастеров", "prising-work")],
  [Markup.callbackButton("Купить украшение", "salons")],
];

module.exports = {
  btnMenu,
  genMenu,
  genTatu,
  helpTatu,
  beckTatu,
  genPiercing,
};
