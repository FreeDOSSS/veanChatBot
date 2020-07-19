const Markup = require("telegraf/markup");
const List = require("./../../../db");

// const renderLists = (ctx, list, name_arr) => {
//   const {
//     filter: { name, limit, offset },
//   } = ctx.session;

//   const arrData = [];

//   const btn_next_studio = { text: ">>", callback_data: "next_studio" };
//   const btn_prev_studio = { text: "<<", callback_data: "prev_studio" };

//   ctx.session.filter.name = name_arr;

//   const maxPage = arrData.length / limit;

//   const render_list = () =>
//     list
//       .filter((item, i) => i > offset && i < offset + limit)
//       .map((el) => [Markup.callbackButton(el.text, `list_item/${el.value}`)])
//       .push([btn_prev_studio, `/${maxPage}`, btn_next_studio]);

//   return inlineKeyboard(render_list());
// };

module.exports = class ListServices {
  constructor(_list, _name, _fn) {
    this.list = _list;
    this.name = _name;
    this.offset = 0;
    this.limit = 5;
    this.max = _list / 5;
    this.callback = _fn;
  }

  renderList() {
    //   TODO Дорого сука, но другого выхода пока нет (stringify)
    const render = this.list
      .filter((el, i) => i > this.offset && i < this.offset + this.limit)
      .map((item) => [Markup.callbackButton(item[this.name], `select_item`)]);
    //   .map((item) => [Markup.callbackButton("1", `select_item/${JSON.stringify(item)}`)]);

    render.push(this.control());

    return render;
  }

  control() {
    // const btn_prev_studio = Markup.callbackButton("<<", "prev_list", !this.offset);
    const btn_prev_studio = Markup.callbackButton("<<", "prev_list");
    const btn_next_studio = Markup.callbackButton(
      ">>",
      "next_list"
      //   this.offset + this.limit === this.list.length
    );
    const info = this.offset / this.limit + 1 + "/" + Math.ceil(this.list.length / this.limit);
    return [btn_prev_studio, Markup.callbackButton(info, "ignore"), btn_next_studio];
  }

  selectItem(ctx) {
    this.callback(ctx, data);
  }

  nextPage() {
    this.offset += this.limit + this.offset < this.list.length - this.limit ? this.limit : 0;
    return this.renderList();
  }

  prevPage() {
    this.offset -= this.offset - this.limit > 0 ? this.limit : 0;
    return this.renderList();
  }
};
