export default {
  namespace: '',
  sortableID: 'asItemList-sortable',
  leng: 'en',
  itemList() {
    'use strict';
    return '<div class="namespace-container">' +
      '<a class="namespace-addItem">' +
      '<i></i>{{strings.addTitle}}' +
      '</a>' +
      '<ul class="namespace-list"></ul>' +
      '<div class="namespace-prompt">{{strings.prompt}}</div>' +
      '</div>';
  },
  render(item) {
    'use strict';
    return item;
  },
  process(value) {
    'use strict';
    if (value) {
      const string = JSON.stringify(value);
      if (string === '[]') {
        return '';
      } else {
        return string;
      }
    }
    return '';
  },
  parse(value) {
    'use strict';
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