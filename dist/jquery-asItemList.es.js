/**
* jQuery asItemList
* a jquery plugin
* Compiled: Thu Aug 18 2016 15:38:23 GMT+0800 (CST)
* @version v0.1.1
* @link https://github.com/amazingSurge/jquery-asItemList
* @copyright LGPL-3.0
*/
import $$1 from 'jQuery';
import Sortable from 'Sortable';

var defaults = {
  namespace: '',
  sortableID: 'asItemList-sortable',
  leng: 'en',

  itemList() {
    return '<div class="namespace-container">' +
      '<a class="namespace-addItem">' +
      '<i></i>{{strings.addTitle}}' +
      '</a>' +
      '<ul class="namespace-list"></ul>' +
      '<div class="namespace-prompt">{{strings.prompt}}</div>' +
      '</div>';
  },
  render(item) {
    return item;
  },
  process(value) {
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

const pluginName = 'asItemList'

defaults.namespace = pluginName;

class asItemList {
  constructor(element, options) {
    this.element = element;
    this.$element = $$1(element);

    this.options = $$1.extend({}, defaults, options, this.$element.data());

    // load lang strings
    if (typeof asItemList.Strings[this.options.lang] === 'undefined') {
      this.lang = 'en';
    } else {
      this.lang = this.options.lang;
    }
    this.strings = $$1.extend({}, asItemList.Strings[this.lang], this.options.strings);

    this._plugin = pluginName;
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
    const self = this;

    // Hide source element
    this.$element.hide();
    // And the list after the select
    this.$element.before(this.$itemList);

    // set value
    this.value = this.options.parse(this.$element.val());
    this.set(this.value, false);

    this.$addItem.on('click', () => {
      self._trigger('add');
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
        onUpdate(evt) {
          const value = self.value.splice(self.sortIndex, 1);
          self.value.splice($$1(evt.item).index(), 0, value[0]);
          self.$element.val(self.options.process(self.value));
          self.sort.destroy();
        }
      });
    }, this)).on('mouseleave', `.${this.namespace}-list-drag`, $$1.proxy(function() {
      this.sort.destroy();
    }, this)).on('click', `.${this.namespace}-list-remove`, $$1.proxy(function(e) {
      this.indexed = $$1(e.currentTarget).parent().index();
      this.remove(this.indexed);
      return false;
    }, this));
  }
  _update() {
    this.$element.val(this.val());
    this._trigger('change', this.value, this.options.name, pluginName);
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
  _trigger(eventType) {
    const method_arguments = Array.prototype.slice.call(arguments, 1),
      data = [this].concat(method_arguments);

    // event
    this.$element.trigger(`asItemList::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
    const onFunction = `on${eventType}`;
    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, method_arguments);
    }
  }
  val(value) {
    if (typeof value === 'undefined') {
      return this.options.process(this.value);
    }

    const value_obj = this.options.parse(value);

    if (value_obj) {
      this.set(value_obj);
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
      this.value.push(item[key]);
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
  }
  disable() {
    this.disabled = true;
    this.$wrapper.addClass(this.classes.disabled);
  }
  destory() {
    this.$element.data(pluginName, null);
    this._trigger('destory');
  }

  static _jQueryInterface(options, ...args) {
    if (typeof options === 'string') {
      if (/^\_/.test(options)) {
        return false;
      } else if ((/^(get)$/.test(options)) || (options === 'val' && args.length === 0)) {
        const api = this.first().data(pluginName);
        if (api && typeof api[options] === 'function') {
          return api[options](...args);
        }
      } else {
        return this.each(function() {
          const api = $$1.data(this, pluginName);
          if (api && typeof api[options] === 'function') {
            api[options](...args);
          }
        });
      }
    } else {
      return this.each(function() {
        if (!$$1.data(this, pluginName)) {
          $$1.data(this, pluginName, new asItemList(this, options));
        }
      });
    }
  }
}

asItemList.defaults = defaults;

asItemList.Strings = {};

asItemList.localize = (lang, label) => {
  asItemList.Strings[lang] = label;
};

asItemList.localize('en', {
  addTitle: 'Add new list',
  prompt: 'There is no item'
});

$$1.fn[pluginName] = asScrollbar._jQueryInterface;
$$1.fn[pluginName].constructor = asScrollbar;
$$1.fn[pluginName].noConflict = () => {
  'use strict';
  $$1.fn[pluginName] = window.JQUERY_NO_CONFLICT;
  return asScrollbar._jQueryInterface;
};

var asScrollbar$1 = asScrollbar;


// }))(window, document, jQuery, ((() => {
//     if (Sortable === undefined) {
//         // console.info('lost dependency lib of Sortable , please load it first !');
//         return false;
//     } else {
//         return Sortable;
//     }
// })()));

export default asScrollbar$1;