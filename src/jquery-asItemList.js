/*
 * jquery-asItemList
 * https://github.com/amazingSurge/jquery-asItemList
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function(window, document, $, Sortable, undefined) {
    // Optional, but considered best practice by some
    "use strict";

    var pluginName = 'asItemList',
        defaults = {
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
                    var string = JSON.stringify(value);
                    if (string === '[]') {
                        return '';
                    } else {
                        return string;
                    }
                } else {
                    return '';
                }
            },
            parse: function(value) {
                if (value) {
                    return $.parseJSON(value);
                } else {
                    return null;
                }
            },
            // callback
            onInit: null,
            onReady: null,
            onAdd: null,
            onEdit: null,
            onAfterFill: null
        };

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, defaults, options, this.$element.data());

        // load lang strings
        if (typeof Plugin.Strings[this.options.lang] === 'undefined') {
            this.lang = 'en';
        } else {
            this.lang = this.options.lang;
        }
        this.strings = $.extend({}, Plugin.Strings[this.lang], this.options.strings);

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

        this.$itemList = $(this.options.itemList().replace(/namespace/g, this.namespace)
            .replace(/\{\{strings.addTitle\}\}/g, this.strings.addTitle).replace(/\{\{strings.prompt\}\}/g, this.strings.prompt));
        this.$addItem = this.$itemList.find('.' + this.namespace + '-addItem');
        this.$prompt = this.$itemList.find('.' + this.namespace + '-prompt');
        this.$list = this.$itemList.find('.' + this.namespace + '-list');
        this.$list.attr('id', this.options.sortableID);

        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,

        init: function() {
            var self = this;

            // Hide source element
            this.$element.hide();
            // And the list after the select
            this.$element.before(this.$itemList);

            // set value
            this.value = this.options.parse(this.$element.val());
            this.set(this.value, false);

            this.$addItem.on('click', function() {
                self._trigger('add');
            });

            var list = document.getElementById(this.options.sortableID);
            this.$list.on('click', 'li', $.proxy(function(e) {
                this.editIndex = $(e.currentTarget).index();
                this._trigger('edit', this.editIndex);
            }, this)).on('mouseenter', 'li', $.proxy(function(e) {
                $(e.currentTarget).addClass(this.classes.hover);
            }, this)).on('mouseleave', 'li', $.proxy(function(e) {
                $(e.currentTarget).removeClass(this.classes.hover);
            }, this)).on('mouseenter', '.' + this.namespace + '-list-drag', $.proxy(function(e) {
                this.sortIndex = $(e.currentTarget).parent().index();
                this.sort = new Sortable(list, {
                    onUpdate: function(evt) {
                        var value = self.value.splice(self.sortIndex, 1);
                        self.value.splice($(evt.item).index(), 0, value[0]);
                        self.$element.val(self.options.process(self.value));
                        self.sort.destroy();
                    }
                });
            }, this)).on('mouseleave', '.' + this.namespace + '-list-drag', $.proxy(function() {
                this.sort.destroy();
            }, this)).on('click', '.' + this.namespace + '-list-remove', $.proxy(function(e) {
                this.indexed = $(e.currentTarget).parent().index();
                this.remove(this.indexed);
                return false;
            }, this));
        },
        _update: function() {
            this.$element.val(this.val());
            this._trigger('change', this.value, this.options.name, pluginName);
        },
        _updateList: function() {
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
        },
        _editList: function(item) {
            return '<span class="' + this.namespace + '-list-drag"></span>' + '<div class="' + this.namespace + '-list-item">' + this.options.render(item) + '</div>' + '<a href="#" class="' + this.namespace + '-list-remove"></a>';
        },
        _addList: function() {
            this.$wrapper.removeClass(this.classes.empty);
            for (var i = this.$list.children().length, item; i < this.value.length; i++) {
                item = this.value[i];
                $('<li/>', {
                    html: this._editList(item)
                }).appendTo(this.$list);
            }
        },
        _delList: function() {
            this.$list.children().eq(this.indexed).remove();
        },
        _clearList: function() {
            this.$list.children().remove();
        },
        _trigger: function(eventType) {
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined,
                data;
            if (method_arguments) {
                data = method_arguments;
                data.push(this);
            } else {
                data = this;
            }
            // event
            this.$element.trigger('asItemList::' + eventType, data);
            this.$element.trigger(eventType + '.asItemList', data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        val: function(value) {
            if (typeof value === 'undefined') {
                return this.options.process(this.value);
            }

            var value_obj = this.options.parse(value);

            if (value_obj) {
                this.set(value_obj);
            } else {
                this.clear();
            }
        },
        set: function(value, update) {
            if ($.isArray(value)) {
                this.value = value;
            } else {
                this.value = [];
            }

            this._clearList();
            this._updateList();

            if (update !== false) {
                this._update();
            }
        },
        clear: function(update) {
            this.value = [];

            this._clearList();
            this.$wrapper.addClass(this.classes.empty);

            if (update !== false) {
                this._update();
            }
        },
        remove: function(index, update) {
            this.value.splice(index, 1);

            this._updateList();

            if (update !== false) {
                this._update();
            }
        },
        add: function(item, update) {
            for (var key in item) {
                this.value.push(item[key]);
            }

            this._updateList();

            if (update !== false) {
                this._update();
            }
        },
        update: function(index, item, update) {
            this.value[index] = item;

            this._updateList();

            if (update !== false) {
                this._update();
            }
        },
        get: function() {
            return this.value;
        },
        enable: function() {
            this.disabled = false;

            // which element is up to your requirement
            this.$wrapper.removeClass(this.classes.disabled);
            // here maybe have some events detached
        },
        disable: function() {
            this.disabled = true;
            // which element is up to your requirement
            // .disabled { pointer-events: none; } NO SUPPORT IE11 BELOW
            this.$wrapper.addClass(this.classes.disabled);
        },
        destory: function() {
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = defaults;

    Plugin.Strings = {};

    Plugin.localize = function(lang, label) {
        Plugin.Strings[lang] = label;
    };

    Plugin.localize('en', {
        addTitle: 'Add new list',
        prompt: 'There is no item'
    });

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments === undefined)) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(window, document, jQuery, (function() {
    "use strict";
    if (Sortable === undefined) {
        // console.info('lost dependency lib of Sortable , please load it first !');
        return false;
    } else {
        return Sortable;
    }
}()));
