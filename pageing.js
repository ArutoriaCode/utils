export default class Pageing {
  /**
   * 分页数据
   * @param {Array} data 要分页的数据
   * @param {Number} size 每页限制几条,默认15条
   */
  constructor(data, size = 15) {
    this.init(data, size)
  }

  /** 初始化或重置分页限制条数 */
  init(data, size) {
    this.data = data
    this.constData = [...data]
    this.size = size
    this.page = 1;
    this.totalPage = Math.ceil(this.constData.length / this.size);
    this._initDataMap(size)
  }

  /** 私有方法，初始化页数及对应数据数组的对象 */
  _initDataMap(size) {
    this.pages = {};
    const len = this.constData.length;
    let page = 0;
    while (page <= this.totalPage) {
      let spare = len - page * size >= size ? size : len - page * size;
      let temp = this.constData.slice(page * size, page * size + spare);
      this.pages[page] = temp;
      page++;
    }
  }

  /** 是否无下一页数据 */
  isEnd() {
    return this.page >= this.totalPage
  }

  /** 获取下一页页数 */
  next() {
    if (this.page >= this.totalPage) {
      return [];
    }

    this.page++
    return this.pages[this.page]
  }

  /** 获取指定页数的数据
   * @param {Number} page
   */
  get(page) {
    return this.pages[page]
  }

  /** 重置页数
   * @param {Number} page
   */
  resetPage(page) {
    this.page = page
  }


  all() {
    return this.constData
  }
}
