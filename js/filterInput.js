(function(win, $) {
    var M = Mustache,
        // widget template
        template = '<div class="inputtxt-wrapper"><input type="text" value="{{init.label}}" name="{{id}}_label" class="input-txt" data-role="label" readonly><input type="hidden" value="{{init.value}}" name="{{id}}_value" data-role="value"><i class="inputtxt-icon drop-icon"></i>{{#clearbtn}}<i class="inputtxt-icon clear-icon"></i> {{/clearbtn}}</div><div class="ui-widget-dropbox ui-widget-hidden" style="top:24px;"><div class="drop-filter"><div class="drop-filter-hd"><div class="ui-widget-inputtxt" style="margin:0"><div class="inputtxt-wrapper"><input type="text" class="input-txt" data-role="filter"><i class="inputtxt-icon find-icon"></i></div></div></div><h4 class="drop-filter-title">{{title}}</h4><div class="drop-filter-bd"><ul>{{#items}}<li data-value="{{value}}" data-label="{{label}}"class="filter-item">{{{hl_label}}}</li>{{/items}}</ul></div></div></div>',
        // template for data items
        items_tmpl = '<ul>{{#items}}<li data-value="{{value}}" data-label="{{label}}" class="filter-item">{{{hl_label}}}</li>{{/items}}</ul>',
        unmatched = '<span style="color:red">no matched data...</span>';

    win.FilterInput = function(cfg) {
        this.cfg = cfg;
        this._init();
    };

    FilterInput.prototype = {
        _filterTimer: null,

        _init: function() {
            this._initView();
            this._initEvent();
        },

        // render html
        _initView: function() {
            var c = this.cfg,
                id = c.id;

            var $widget = $('#' + id);

            c.styleCls ? $widget.addClass(c.styleCls) : '';
            $widget.css('width', c.width ? c.width : 250)
                .addClass('ui-widget-inputtxt');

            if (!/^r|^a/g.test($widget.css('position'))) {
                $widget.css('position', 'relative');
            }

            var selected;

            $.each(c.items, function(i, item) {
                item.hl_label = item.label;

                if (item.selected) selected = item;
            });

            var html = M.render(template, {
                init: {
                    label: selected ? selected.label : '',
                    value: selected ? selected.value : ''
                },
                title: c.title,
                items: c.items,
                clearbtn: c.clearbtn ? true : false,
                id: id
            });

            $widget.html(html);

            $.extend(this, {
                $lbl_input: $('input[data-role="label"]', $widget),
                $val_input: $('input[data-role="value"]', $widget),

                $drop_btn: $('.drop-icon', $widget),
                $drop: $('.ui-widget-dropbox', $widget),

                $lbl_input: $('input[data-role="label"]', $widget),
                $val_input: $('input[data-role="value"]', $widget),

                $filter_input: $('input[data-role="filter"]', $widget),
                $items_wrap: $('.drop-filter-bd', $widget)
            });

            this.$drop.css('width', $widget.innerWidth());

            this.$widget = $widget;
        },

        _hide: function() {
            var $drop_btn = this.$drop_btn,
                $drop = this.$drop;

            $drop.addClass('ui-widget-hidden');
            $drop_btn.data('state', 'closed');
        },

        _show: function() {
            var $drop_btn = this.$drop_btn,
                $drop = this.$drop;

            $drop.removeClass('ui-widget-hidden');
            $drop_btn.data('state', 'opened');
        },

        _getFilterItems: function(keyword) {
            var c = this.cfg,
                items = c.items,
                rt = [];

            if (keyword.length) {
                $.each(items, function(index, item) {
                    var lbl = item.label,
                        reg = new RegExp(keyword, 'i'),
                        n = lbl.search(reg),
                        tmp = [];

                    if (n !== -1) {
                        tmp.push(lbl.substr(0, n));
                        tmp.push('<b>' + lbl.substr(n, keyword.length) + '</b>');
                        tmp.push(lbl.substr(n + keyword.length));

                        item.hl_label = tmp.join('');
                        rt.push(item);
                    }
                });

                !rt.length && rt.push({
                    hl_label: unmatched
                });
                return rt;

            } else {
                $.each(items, function(index, item) {
                    item.hl_label = item.label;
                });

                return items;
            }
        },

        _resetItems: function() {
            this.$items_wrap.html(M.render(items_tmpl, {
                items: this._getFilterItems('')
            }));
        },

        // init events
        _initEvent: function() {
            var c = this.cfg,
                $widget = this.$widget,
                self = this;

            $(document).on('click', function(event) {
                var t = event.target;

                if (!$.contains($widget[0], t)) {
                    self._hide();
                }
            });

            $widget.on('click', '.drop-icon', function() {
                var $el = $(this);

                $el.data('state') == 'opened' ?
                    self._hide() :
                    self._show();

            }).on('click', '.clear-icon', function() {
                self.$val_input[0].value = '';
                self.$lbl_input[0].value = '';
                self.$filter_input[0].value = '';

                self._resetItems();

            }).on('click', '.filter-item', function() {
                var val = this.getAttribute('data-value'),
                    lbl = this.getAttribute('data-label');

                if (!val) return;

                self.$val_input[0].value = val;
                self.$lbl_input[0].value = lbl;

                self._hide();

                c.select ? $.proxy(c.select, self, val)() : '';

            }).on('keyup', '[data-role="filter"]', function() {
                var keyword = $.trim(this.value);

                clearTimeout(self._filterTimer);

                self._filterTimer = setTimeout(function() {
                    var $wrap = self.$items_wrap;

                    $wrap.html(M.render(items_tmpl, {
                        items: self._getFilterItems(keyword)
                    }));
                }, 100);
            });
        }
    }
}(this, jQuery))
