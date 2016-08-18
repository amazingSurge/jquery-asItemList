/**
* jQuery asItemList
* a jquery plugin
* Compiled: Thu Aug 18 2016 15:40:40 GMT+0800 (CST)
* @version v0.1.1
* @link https://github.com/amazingSurge/jquery-asItemList
* @copyright LGPL-3.0
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'jQuery', 'Sortable'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jQuery'), require('Sortable'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Sortable);
    global.jqueryAsItemList = mod.exports;
  }
})(this,

  function(exports, _jQuery, _Sortable) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    var _Sortable2 = _interopRequireDefault(_Sortable);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var defaults = {
      namespace: '',
      sortableID: 'asItemList-sortable',
      leng: 'en',

      itemList: function itemList() {
        return '<div class="namespace-container">' + '<a class="namespace-addItem">' + '<i></i>{{strings.addTitle}}' + '</a>' + '<ul class="namespace-list"></ul>' + '<div class="namespace-prompt">{{strings.prompt}}</div>' + '</div>';
      },
      render: function render(item) {
        return item;
      },
      process: function process(value) {
        if (value) {
          var string = JSON.stringify(value);

          if (string === '[]') {

            return '';
          } else {

            return string;
          }
        }

        return '';
      },
      parse: function parse(value) {
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

    var pluginName = 'asItemList';

    defaults.namespace = pluginName;

    var asItemList = function() {
      function asItemList(element, options) {
        _classCallCheck(this, asItemList);

        this.element = element;
        this.$element = (0, _jQuery2.default)(element);

        this.options = _jQuery2.default.extend({}, defaults, options, this.$element.data());

        // load lang strings

        if (typeof asItemList.Strings[this.options.lang] === 'undefined') {
          this.lang = 'en';
        } else {
          this.lang = this.options.lang;
        }
        this.strings = _jQuery2.default.extend({}, asItemList.Strings[this.lang], this.options.strings);

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.classes = {
          disabled: this.namespace + '_disabled',
          wrapper: this.namespace + '-wrapper',
          active: this.namespace + '_active',
          empty: this.namespace + '_empty',
          hide: this.namespace + '_hide',
          hover: this.namespace + '_hover'
        };

        this.$element.addClass(this.namespace);
        this.$element.wrap('<div class="' + this.classes.wrapper + '"></div>');
        this.$wrapper = this.$element.parent();

        this.$itemList = (0, _jQuery2.default)(this.options.itemList().replace(/namespace/g, this.namespace).replace(/\{\{strings.addTitle\}\}/g, this.strings.addTitle).replace(/\{\{strings.prompt\}\}/g, this.strings.prompt));
        this.$addItem = this.$itemList.find('.' + this.namespace + '-addItem');
        this.$prompt = this.$itemList.find('.' + this.namespace + '-prompt');
        this.$list = this.$itemList.find('.' + this.namespace + '-list');
        this.$list.attr('id', this.options.sortableID);

        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');
        this.init();
      }

      _createClass(asItemList, [{
        key: 'init',
        value: function init() {
          var self = this;

          // Hide source element
          this.$element.hide();
          // And the list after the select
          this.$element.before(this.$itemList);

          // set value
          this.value = this.options.parse(this.$element.val());
          this.set(this.value, false);

          this.$addItem.on('click',

            function() {
              self._trigger('add');
            }
          );

          var list = document.getElementById(this.options.sortableID);
          this.$list.on('click', 'li', _jQuery2.default.proxy(

            function(e) {
              this.editIndex = (0, _jQuery2.default)(e.currentTarget).index();
              this._trigger('edit', this.editIndex);
            }
            , this)).on('mouseenter', 'li', _jQuery2.default.proxy(

            function(e) {
              (0, _jQuery2.default)(e.currentTarget).addClass(this.classes.hover);
            }
            , this)).on('mouseleave', 'li', _jQuery2.default.proxy(

            function(e) {
              (0, _jQuery2.default)(e.currentTarget).removeClass(this.classes.hover);
            }
            , this)).on('mouseenter', '.' + this.namespace + '-list-drag', _jQuery2.default.proxy(

            function(e) {
              this.sortIndex = (0, _jQuery2.default)(e.currentTarget).parent().index();
              this.sort = new _Sortable2.default(list, {
                onUpdate: function onUpdate(evt) {
                  var value = self.value.splice(self.sortIndex, 1);
                  self.value.splice((0, _jQuery2.default)(evt.item).index(), 0, value[0]);
                  self.$element.val(self.options.process(self.value));
                  self.sort.destroy();
                }
              });
            }
            , this)).on('mouseleave', '.' + this.namespace + '-list-drag', _jQuery2.default.proxy(

            function() {
              this.sort.destroy();
            }
            , this)).on('click', '.' + this.namespace + '-list-remove', _jQuery2.default.proxy(

            function(e) {
              this.indexed = (0, _jQuery2.default)(e.currentTarget).parent().index();
              this.remove(this.indexed);

              return false;
            }
            , this));
        }
      }, {
        key: '_update',
        value: function _update() {
          this.$element.val(this.val());
          this._trigger('change', this.value, this.options.name, pluginName);
        }
      }, {
        key: '_updateList',
        value: function _updateList() {
          if (this.value.length > this.$list.children().length) {
            this._addList();
          } else if (this.value.length === this.$list.children().length && this.value.length !== 0) {
            var item = this.value[this.editIndex];
            this.$list.children().eq(this.editIndex).html(this._editList(item));
          } else {

            if (this.value.length === 0) {
              this.$wrapper.addClass(this.classes.empty);
            }
            this._delList();
          }
        }
      }, {
        key: '_editList',
        value: function _editList(item) {
          return '<span class="' + this.namespace + '-list-drag"></span><div class="' + this.namespace + '-list-item">' + this.options.render(item) + '</div><a href="#" class="' + this.namespace + '-list-remove"></a>';
        }
      }, {
        key: '_addList',
        value: function _addList() {
          this.$wrapper.removeClass(this.classes.empty);

          for (var i = this.$list.children().length, item; i < this.value.length; i++) {
            item = this.value[i];
            (0, _jQuery2.default)('<li/>', {
              html: this._editList(item)
            }).appendTo(this.$list);
          }
        }
      }, {
        key: '_delList',
        value: function _delList() {
          this.$list.children().eq(this.indexed).remove();
        }
      }, {
        key: '_clearList',
        value: function _clearList() {
          this.$list.children().remove();
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          var method_arguments = Array.prototype.slice.call(arguments, 1),
            data = [this].concat(method_arguments);

          // event
          this.$element.trigger('asItemList::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            this.options[onFunction].apply(this, method_arguments);
          }
        }
      }, {
        key: 'val',
        value: function val(value) {
          if (typeof value === 'undefined') {

            return this.options.process(this.value);
          }

          var value_obj = this.options.parse(value);

          if (value_obj) {
            this.set(value_obj);
          } else {
            this.clear();
          }
        }
      }, {
        key: 'set',
        value: function set(value, update) {
          if (_jQuery2.default.isArray(value)) {
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
      }, {
        key: 'clear',
        value: function clear(update) {
          this.value = [];

          this._clearList();
          this.$wrapper.addClass(this.classes.empty);

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'remove',
        value: function remove(index, update) {
          this.value.splice(index, 1);

          this._updateList();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'add',
        value: function add(item, update) {
          for (var key in item) {
            this.value.push(item[key]);
          }

          this._updateList();

          if (update !== false) {
            this._update();
          }
        }
      }, {
        key: 'update',
        value: function update(index, item, _update2) {
          this.value[index] = item;

          this._updateList();

          if (_update2 !== false) {
            this._update();
          }
        }
      }, {
        key: 'get',
        value: function get() {
          return this.value;
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.disabled = false;
          this.$wrapper.removeClass(this.classes.disabled);
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$wrapper.addClass(this.classes.disabled);
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(pluginName, null);
          this._trigger('destory');
        }
      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(options) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          if (typeof options === 'string') {

            if (/^\_/.test(options)) {

              return false;
            } else if (/^(get)$/.test(options) || options === 'val' && args.length === 0) {
              var api = this.first().data(pluginName);

              if (api && typeof api[options] === 'function') {

                return api[options].apply(api, args);
              }
            } else {

              return this.each(

                function() {
                  var api = _jQuery2.default.data(this, pluginName);

                  if (api && typeof api[options] === 'function') {
                    api[options].apply(api, args);
                  }
                }
              );
            }
          } else {

            return this.each(

              function() {
                if (!_jQuery2.default.data(this, pluginName)) {
                  _jQuery2.default.data(this, pluginName, new asItemList(this, options));
                }
              }
            );
          }
        }
      }]);

      return asItemList;
    }();

    asItemList.defaults = defaults;

    asItemList.Strings = {};

    asItemList.localize = function(lang, label) {
      asItemList.Strings[lang] = label;
    }
    ;

    asItemList.localize('en', {
      addTitle: 'Add new list',
      prompt: 'There is no item'
    });

    _jQuery2.default.fn[pluginName] = asItemList._jQueryInterface;
    _jQuery2.default.fn[pluginName].constructor = asItemList;
    _jQuery2.default.fn[pluginName].noConflict = function() {
      'use strict';

      _jQuery2.default.fn[pluginName] = window.JQUERY_NO_CONFLICT;

      return asItemList._jQueryInterface;
    }
    ;

    exports.default = asItemList;
  }
);