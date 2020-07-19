const Markup = require("telegraf/markup");

module.exports = class ListServices {
  constructor(_list, _name, _fn) {
    this.list = _list;
    this.name = _name;
    this.offset = 0;
    this.limit = 5;
    this.callback = _fn;
  }

  renderList() {
    const render = this.list
      .filter((el, i) => i >= this.offset && i < this.offset + this.limit)
      .map((item, i) => [Markup.callbackButton(item[this.name], `select_item/${i}`)]);

    render.push(this.control());

    return render;
  }

  control() {
    const btn_prev_studio = Markup.callbackButton("<<", "prev_list", !this.offset);
    const btn_next_studio = Markup.callbackButton(
      ">>",
      "next_list",
      this.list.length - this.offset <= this.limit
    );
    const info = this.offset / this.limit + 1 + "/" + Math.ceil(this.list.length / this.limit);
    return [btn_prev_studio, Markup.callbackButton(info, "ignore"), btn_next_studio];
  }

  selectItem(ctx) {
    const index = ctx.match.input.replace("select_item/", "");

    const data = this.list.filter((el, i) => i >= this.offset && i < this.offset + this.limit)[
      index
    ];
    this.callback(ctx, data);
  }

  nextPage() {
    this.offset += this.limit + this.offset < this.list.length ? this.limit : 0;
    return this.renderList();
  }

  prevPage() {
    this.offset -= this.offset - this.limit > 0 ? this.limit : 0;
    return this.renderList();
  }
};
