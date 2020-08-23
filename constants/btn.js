const Markup = require("telegraf/markup");
const btnMenu = [["Меню"], ["Салоны"], ["Я не нашёл ответа на вопрос"]];
const btnSendNews = [
  [Markup.callbackButton("✅", "sendNews/send"), Markup.callbackButton("❌", "sendNews/cancel")],
];

const genMenu = [
  [Markup.callbackButton("Тату", "gen-tatu")],
  [Markup.callbackButton("Пирсинг", "genPirsing")],
  [Markup.callbackButton("Татуаж", "gen-tatuaz")],
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
const genTatuaz = [
  [Markup.callbackButton("Брови", "tatuaz/brovi")],
  [Markup.callbackButton("Стрелки", "tatuaz/arrow")],
  [Markup.callbackButton("Губы", "tatuaz/guby")],
  [Markup.callbackButton("Консультация", "tatuaz/form")],
];

const genRemoved = [
  [Markup.callbackButton("Результаты сеансов", "removed/result")],
  [Markup.callbackButton("Описание процесса", "removed/process")],
  [Markup.callbackButton("Записаться на сеанс", "removed/form")],
];

const sessionsRemoved = [
  [Markup.callbackButton("Один сеанс", "removed/session_1")],
  [Markup.callbackButton("Три сеанс", "removed/session_3")],
  [Markup.callbackButton("Пять сеансов", "removed/session_5")],
  [Markup.callbackButton("Назад", "removed/prev")],
];

const genSchool = [
  [Markup.callbackButton("Тату", "school/tatu")],
  [Markup.callbackButton("Татуаж", "school/tatuaz")],
  [Markup.callbackButton("Пирсинг", "school/piercing")],
  [Markup.callbackButton("Мне нужна консультация", "school/help")],
];

module.exports = {
  btnMenu,
  genMenu,
  genTatu,
  helpTatu,
  beckTatu,
  genPiercing,
  genTatuaz,
  genRemoved,
  sessionsRemoved,
  genSchool,
  btnSendNews,
};
