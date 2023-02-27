export default class Pagged {
  constructor(items, page, totalpagesCount, totalItemsCount) {
    this.items = items;
    this.page = page;
    this.totalpagesCount = totalpagesCount;
    this.totalItemsCount = totalItemsCount;
  }
}
