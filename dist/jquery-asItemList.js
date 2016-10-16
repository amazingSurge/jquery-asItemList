/**
* jQuery asItemList v0.2.0
* https://github.com/amazingSurge/jquery-asItemList
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery', 'Sortable'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'), require('Sortable'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery, global.Sortable);
    global.jqueryAsItemListEs = mod.exports;
  }
})(this,

  function(_jquery, _Sortable) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    var _Sortable2 = _interopRequireDefault(_Sortable);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

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

    var DEFAULTS = {
      namespace: 'asItemList',
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
          }

          return string;
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

    var NAMESPACE$1 = 'asItemList';
    var STRINGS = {};

    var asItemList = function() {
      function asItemList(element, options) {
        _classCallCheck(this, asItemList);

        this.element = element;
        this.$element = (0, _jquery2.default)(element);

        this.options = _jquery2.default.extend({}, DEFAULTS, options, this.$element.data());

        // load lang strings

        if (typeof STRINGS[this.options.lang] === 'undefined') {
          this.lang = 'en';
        } else {
          this.lang = this.options.lang;
        }
        this.strings = _jquery2.default.extend({}, STRINGS[this.lang], this.options.strings);

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

        this.$itemList = (0, _jquery2.default)(this.options.itemList().replace(/namespace/g, this.namespace).replace(/\{\{strings.addTitle\}\}/g, this.strings.addTitle).replace(/\{\{strings.prompt\}\}/g, this.strings.prompt));
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
          var that = this;

          // Hide source element
          this.$element.hide();
          // And the list after the select
          this.$element.before(this.$itemList);

          // set value
          this.value = this.options.parse(this.$element.val());
          this.set(this.value, false);

          this.$addItem.on('click',

            function() {
              that._trigger('add');
            }
          );

          var list = document.getElementById(this.options.sortableID);
          this.$list.on('click', 'li', _jquery2.default.proxy(

            function(e) {
              this.editIndex = (0, _jquery2.default)(e.currentTarget).index();
              this._trigger('edit', this.editIndex);
            }
            , this)).on('mouseenter', 'li', _jquery2.default.proxy(

            function(e) {
              (0, _jquery2.default)(e.currentTarget).addClass(this.classes.hover);
            }
            , this)).on('mouseleave', 'li', _jquery2.default.proxy(

            function(e) {
              (0, _jquery2.default)(e.currentTarget).removeClass(this.classes.hover);
            }
            , this)).on('mouseenter', '.' + this.namespace + '-list-drag', _jquery2.default.proxy(

            function(e) {
              this.sortIndex = (0, _jquery2.default)(e.currentTarget).parent().index();
              this.sort = new _Sortable2.default(list, {
                onUpdate: function onUpdate(evt) {
                  var value = that.value.splice(that.sortIndex, 1);
                  that.value.splice((0, _jquery2.default)(evt.item).index(), 0, value[0]);
                  that.$element.val(that.options.process(that.value));
                // if(that.sort) {
                //   that.sort.destroy();
                // }
                }
              });
            }
            , this)).on('mouseleave', '.' + this.namespace + '-list-drag', _jquery2.default.proxy(

            function() {
              // if(this.sort) {
              //   this.sort.destroy();
              // }
            }
            , this)).on('click', '.' + this.namespace + '-list-remove', _jquery2.default.proxy(

            function(e) {
              this.indexed = (0, _jquery2.default)(e.currentTarget).parent().index();
              this.remove(this.indexed);

              return false;
            }
            , this));
        }
      }, {
        key: '_update',
        value: function _update() {
          this.$element.val(this.val());
          this._trigger('change', [this.value]);
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
            (0, _jquery2.default)('<li/>', {
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
          var _ref;

          for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
          }

          var data = (_ref = [this]).concat.apply(_ref, params);

          // event
          this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            var _options$onFunction;

            (_options$onFunction = this.options[onFunction]).apply.apply(_options$onFunction, [this].concat(params));
          }
        }
      }, {
        key: 'val',
        value: function val(value) {
          if (typeof value === 'undefined') {

            return this.options.process(this.value);
          }

          var valueObj = this.options.parse(value);

          if (valueObj) {
            this.set(valueObj);
          } else {
            this.clear();
          }
        }
      }, {
        key: 'set',
        value: function set(value, update) {
          if (_jquery2.default.isArray(value)) {
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

            if ({}.hasOwnProperty.call(item, key)) {
              this.value.push(item[key]);
            }
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
          this._trigger('enable');
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$wrapper.addClass(this.classes.disabled);
          this._trigger('disable');
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(NAMESPACE$1, null);
          this._trigger('destory');
        }
      }], [{
        key: 'localize',
        value: function localize(lang, label) {
          STRINGS[lang] = label;
        }
      }, {
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return asItemList;
    }();

    asItemList.localize('en', {
      addTitle: 'Add new list',
      prompt: 'There is no item'
    });

    var info = {
      version: '0.2.0'
    };

    var NAMESPACE = 'asItemList';
    var OtherAsItemList = _jquery2.default.fn.asItemList;

    var jQueryAsItemList = function jQueryAsItemList(options) {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get|val)/.test(method)) {
            var instance = _this.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

          return _ret.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new asItemList(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.asItemList = jQueryAsItemList;

    _jquery2.default.asItemList = _jquery2.default.extend({
      setDefaults: asItemList.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asItemList = OtherAsItemList;

        return jQueryAsItemList;
      }
    }, info);
  }
);