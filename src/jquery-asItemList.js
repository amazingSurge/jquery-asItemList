/*
 * jquery-asItemList
 * https://github.com/amazingSurge/jquery-asItemList
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($, document, window, undefined) {
    // Optional, but considered best practice by some
    "use strict";

    var pluginName = 'asItemList',
        defaults = {
            namespace:    'asItemList',
            name:         null,
            sortableID:   'asItemList-sortable',

            itemList: function() {
                return  '<div class="namespace-container">' +
                            '<a class="namespace-addItem">' +
                                '<i></i>Add new list' +
                            '</a>' +
                            '<ul class="namespace-list"></ul>' +
                        '</div>';
            },
            render: function(item) {},
            process: function(value) {
                if (value) {
                    return JSON.stringify(value);
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

        if (this.$element.attr('name')) {
            this.name = this.$element.attr('name');
        }else {
            this.name = options.name;
        }

        this.options = $.extend({}, defaults, options, this.$element.data());

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.classes = {
            disabled: this.namespace + '_disabled',
            wrapper: this.namespace + '-wrapper',
            active: this.namespace + '_active',
            hide: this.namespace + '_hide',
            hover: this.namespace + '_hover'
        };

        this.$element.addClass(this.namespace);
        this.$element.wrap('<div class="' + this.classes.wrapper + '"></div>');
        this.$wrapper = this.$element.parent();

        this.$itemList = $(this.options.itemList().replace(/namespace/g, this.namespace));
        this.$addItem = this.$itemList.find('.' + this.namespace + '-addItem');
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

            // get value
            this._getList();

            this.$addItem.on('click', function() {
                self._trigger('add');
            });

            var list = document.getElementById(this.options.sortableID);
            this.$list.on('click', 'li', $.proxy(function(e) {
                this._trigger('edit', e.currentTarget);
            }, this)).on('mouseenter', 'li', $.proxy(function(e) {
                $(e.currentTarget).addClass(this.classes.hover);
            }, this)).on('mouseleave', 'li', $.proxy(function(e) {
                $(e.currentTarget).removeClass(this.classes.hover);
            }, this)).on('mouseenter', '.' + this.namespace + '-drag', $.proxy(function(e) {
                this.sort = new Sortable(list, {
                    onUpdate: function(evt) {
                        var index = $(evt.item).data('index');
                        var value = self.value.splice(index,1);
                        self.value.splice($(evt.item).index(), 0, value[0]);
                        self.$element.val(self.options.process(self.value));
                        self.sort.destroy();
                    }
                });
            }, this)).on('mouseleave', '.' + this.namespace + '-drag', $.proxy(function(e) {
                this.sort.destroy();
            }, this)).on('click', '.' + this.namespace + '-delete', $.proxy(function(e) {
                this.delete($(e.currentTarget).parent().index());
                return false;
            }, this));
        },
        _getList: function() {
            var value = this.$element.val();
            if (value) {
                this.value = this.options.parse(value);
            } else {
                this.value = {};
            }

            // show list
            if (this.value.length > 0) {
                this.$list.html('');
                this._showList();
            }else {
                this.$list.html('<li>There is no item</li>');
            }
        },
        _showList: function() {
            var self = this;
            if(typeof this.$list.data('scroll') !=='undefined'){
                this.$list.asScrollable('destory');
            }

            for (var i = 0, item; item = this.value[i]; i++) {
                $('<li/>', {
                    html:   '<span class="' + this.namespace + '-drag"></span>' +
                            '<div class="' + this.namespace + '-item">' + this.options.render(item) + '</div>' +
                            '<a href="#" class="' + this.namespace + '-delete"></a>',
                }).data('index', i).appendTo(this.$list);
            }
        },
        _trigger: function(eventType) {
            // event
            this.$element.trigger('asUnitInput::' + eventType, this);
            this.$element.trigger(eventType + '.asUnitInput', this);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        delete: function(index) {
            this.value.splice(index, 1);
            this.$element.val(this.options.process(this.value));
            this._getList();
        },
        add: function(value) {
            value = this.options.parse(value);
            this.value.push(value);
            this.$element.val(this.options.process(this.value));
            this._getList();
        },
        update: function(value) {
            this._getList();
        },
        get: function() {
            var current = this.$element.val();

            if (this.value.length === 0) {
                current = null;
            }

            return current;
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

            // here maybe have some events attached
        },
        destory: function() {
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = defaults;

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
})(jQuery, document, window);