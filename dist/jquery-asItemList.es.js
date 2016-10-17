/**
* jQuery asItemList v0.2.1
* https://github.com/amazingSurge/jquery-asItemList
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $$1 from 'jquery';
import Sortable from 'Sortable';

var DEFAULTS = {
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

const NAMESPACE$1 = 'asItemList';
const STRINGS = {};

class asItemList {
  constructor(element, options) {
    this.element = element;
    this.$element = $$1(element);

    this.options = $$1.extend({}, DEFAULTS, options, this.$element.data());

    // load lang strings
    if (typeof STRINGS[this.options.lang] === 'undefined') {
      this.lang = 'en';
    } else {
      this.lang = this.options.lang;
    }
    this.strings = $$1.extend({}, STRINGS[this.lang], this.options.strings);

    this.namespace = this.options.namespace;

    this.classes = {
      disabled: `${this.namespace}_disabled`,
      wrapper: `${this.namespace}-wrapper`,
      active: `${this.namespace}_active`,
      empty: `${this.namespace}_empty`,
      hide: `${this.namespace}_hide`,
      hover: `${this.namespace}_hover`
    };

    this.$element.addClass(this.namespace);
    this.$element.wrap(`<div class="${this.classes.wrapper}"></div>`);
    this.$wrapper = this.$element.parent();

    this.$itemList = $$1(this.options.itemList().replace(/namespace/g, this.namespace)
      .replace(/\{\{strings.addTitle\}\}/g, this.strings.addTitle).replace(/\{\{strings.prompt\}\}/g, this.strings.prompt));
    this.$addItem = this.$itemList.find(`.${this.namespace}-addItem`);
    this.$prompt = this.$itemList.find(`.${this.namespace}-prompt`);
    this.$list = this.$itemList.find(`.${this.namespace}-list`);
    this.$list.attr('id', this.options.sortableID);

    // flag
    this.disabled = false;
    this.initialized = false;

    this._trigger('init');
    this.init();
  }

  init() {
    const that = this;

    // Hide source element
    this.$element.hide();
    // And the list after the select
    this.$element.before(this.$itemList);

    // set value
    this.value = this.options.parse(this.$element.val());
    this.set(this.value, false);

    this.$addItem.on('click', () => {
      that._trigger('add');
    });

    const list = document.getElementById(this.options.sortableID);
    this.$list.on('click', 'li', $$1.proxy(function(e) {
      this.editIndex = $$1(e.currentTarget).index();
      this._trigger('edit', this.editIndex);
    }, this)).on('mouseenter', 'li', $$1.proxy(function(e) {
      $$1(e.currentTarget).addClass(this.classes.hover);
    }, this)).on('mouseleave', 'li', $$1.proxy(function(e) {
      $$1(e.currentTarget).removeClass(this.classes.hover);
    }, this)).on('mouseenter', `.${this.namespace}-list-drag`, $$1.proxy(function(e) {
      this.sortIndex = $$1(e.currentTarget).parent().index();
      this.sort = new Sortable(list, {
        onUpdate: function(evt) {
          const value = that.value.splice(that.sortIndex, 1);
          that.value.splice($$1(evt.item).index(), 0, value[0]);
          that.$element.val(that.options.process(that.value));
          // if(that.sort) {
          //   that.sort.destroy();
          // }
        }
      });
    }, this)).on('mouseleave', `.${this.namespace}-list-drag`, $$1.proxy(function() {
      // if(this.sort) {
      //   this.sort.destroy();
      // }
    }, this)).on('click', `.${this.namespace}-list-remove`, $$1.proxy(function(e) {
      this.indexed = $$1(e.currentTarget).parent().index();
      this.remove(this.indexed);
      return false;
    }, this));
  }

  _update() {
    this.$element.val(this.val());
    this._trigger('change', this.value);
  }

  _updateList() {
    if (this.value.length > this.$list.children().length) {
      this._addList();
    } else if (this.value.length === this.$list.children().length && this.value.length !== 0) {
      const item = this.value[this.editIndex];
      this.$list.children().eq(this.editIndex).html(this._editList(item));
    } else {
      if (this.value.length === 0) {
        this.$wrapper.addClass(this.classes.empty);
      }
      this._delList();
    }
  }
  _editList(item) {
    return `<span class="${this.namespace}-list-drag"></span><div class="${this.namespace}-list-item">${this.options.render(item)}</div><a href="#" class="${this.namespace}-list-remove"></a>`;
  }

  _addList() {
    this.$wrapper.removeClass(this.classes.empty);
    for (let i = this.$list.children().length, item; i < this.value.length; i++) {
      item = this.value[i];
      $$1('<li/>', {
        html: this._editList(item)
      }).appendTo(this.$list);
    }
  }

  _delList() {
    this.$list.children().eq(this.indexed).remove();
  }

  _clearList() {
    this.$list.children().remove();
  }

  _trigger(eventType, ...params) {
    let data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  val(value) {
    if (typeof value === 'undefined') {
      return this.options.process(this.value);
    }

    const valueObj = this.options.parse(value);

    if (valueObj) {
      this.set(valueObj);
    } else {
      this.clear();
    }
  }

  set(value, update) {
    if ($$1.isArray(value)) {
      this.value = value;
    } else {
      this.value = [];
    }

    this._clearList();
    this._updateList();

    if (update !== false) {
      this._update();
    }
  }

  clear(update) {
    this.value = [];

    this._clearList();
    this.$wrapper.addClass(this.classes.empty);

    if (update !== false) {
      this._update();
    }
  }

  remove(index, update) {
    this.value.splice(index, 1);

    this._updateList();

    if (update !== false) {
      this._update();
    }
  }

  add(item, update) {
    for (const key in item) {
      if ({}.hasOwnProperty.call(item, key)) {
        this.value.push(item[key]);
      }
    }

    this._updateList();

    if (update !== false) {
      this._update();
    }
  }

  update(index, item, update) {
    this.value[index] = item;

    this._updateList();

    if (update !== false) {
      this._update();
    }
  }

  get() {
    return this.value;
  }

  enable() {
    this.disabled = false;
    this.$wrapper.removeClass(this.classes.disabled);
    this._trigger('enable');
  }

  disable() {
    this.disabled = true;
    this.$wrapper.addClass(this.classes.disabled);
    this._trigger('disable');
  }

  destroy() {
    this.$element.data(NAMESPACE$1, null);
    this._trigger('destroy');
  }

  static localize(lang, label) {
    STRINGS[lang] = label;
  }

  static setDefaults(options) {
    $$1.extend(DEFAULTS, $$1.isPlainObject(options) && options);
  }
}

asItemList.localize('en', {
  addTitle: 'Add new list',
  prompt: 'There is no item'
});

var info = {
  version:'0.2.1'
};

const NAMESPACE = 'asItemList';
const OtherAsItemList = $$1.fn.asItemList;

const jQueryAsItemList = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get|val)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $$1.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$$1(this).data(NAMESPACE)) {
      $$1(this).data(NAMESPACE, new asItemList(this, options));
    }
  });
};

$$1.fn.asItemList = jQueryAsItemList;

$$1.asItemList = $$1.extend({
  setDefaults: asItemList.setDefaults,
  noConflict: function() {
    $$1.fn.asItemList = OtherAsItemList;
    return jQueryAsItemList;
  }
}, info);
