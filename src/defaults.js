export default {
  namespace: 'asItemList',
  sortableID: 'asItemList-sortable',
  leng: 'en',
  itemList: function() {
    return '<div class="namespace-container">' +
      '<a class="namespace-addItem">' +
      '<i></i>{{strings.addTitle}}' +
      '</a>' +
      '<ul class="namespace-list"></ul>' +
      '<div class="namespace-prompt">{{strings.prompt}}</div>' +
      '</div>';
  },
  render: function(item) {
    return item;
  },
  process: function(value) {
    if (value) {
      const string = JSON.stringify(value);
      if (string === '[]') {
        return '';
      }
      return string;
    }
    return '';
  },
  parse: function(value) {
    if (value) {
      return $.parseJSON(value);
    }
    return null;
  },
  // callback
  onInit: null,
  onReady: null,
  onAdd: null,
  onEdit: null,
  onAfterFill: null
};
