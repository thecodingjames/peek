export default class KeyValueModel {

  static create(key = '', value = '') {
    return {
      id: crypto.randomUUID(),
      key,
      value,
      enabled: true,
    }
  }

  static ignored(pair) {
    return !pair?.enabled || pair?.key?.trim() == ''
  }

  constructor(pairs) {
    this.pairs = pairs ?? []
  }

  new() {
    this.pairs.push(
      KeyValueModel.create()
    )
  }

  remove(id) {
    this.pairs = this.pairs.filter(p => p.id != id)
  }

  sort(oldIndex, newIndex) {
    const moved = this.pairs.splice(oldIndex, 1)[0]
    this.pairs.splice(newIndex, 0, moved)
  }

}
