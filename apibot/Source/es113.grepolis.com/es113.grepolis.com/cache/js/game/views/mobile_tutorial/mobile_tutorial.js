(function() {
    "use strict";

    var View = window.GameViews.BaseView;

    var MobileTutorialView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('main'), {
                l10n: this.l10n
            }));

            this.registerComponents();
            this.showTutorialPage();
        },

        registerComponents: function() {
            this.unregisterComponent('btn_dont_show_tutorial');
            this.registerComponent('btn_dont_show_tutorial', this.$el.find('.btn_dont_show_tutorial').button({
                template: 'empty'
            }).on('btn:click', this.controller.onBtnDontShowTutorialAgainClick.bind(this.controller)));

            this.unregisterComponent('prev_page_btn');
            this.registerComponent('prev_page_btn', this.$el.find('.prev_page_btn').button({
                caption: this.l10n.previous,
                disabled: this.controller.isFirstPageActive(),
                state: this.controller.isFirstPageActive()
            }).on('btn:click', function() {
                this.controller.setTutorialPage(-1);
                this.showTutorialPage();
            }.bind(this)));

            this.unregisterComponent('next_page_btn');
            this.registerComponent('next_page_btn', this.$el.find('.next_page_btn').button({
                caption: this.l10n.next,
                disabled: this.controller.isLastPageActive(),
                state: this.controller.isLastPageActive()
            }).on('btn:click', function() {
                this.controller.setTutorialPage(1);
                this.showTutorialPage();
            }.bind(this)));
        },

        showTutorialPage: function() {
            var $pages = this.$el.find('.mobile_tutorial').find('.page'),
                $page = $pages.eq(this.controller.getCurrentPage());

            //Hide all pages
            $pages.hide();

            //Show only active page
            $page.show();

            this.updateButtons();
        },

        updateButtons: function() {
            var next_page_btn = this.getComponent('next_page_btn'),
                prev_page_btn = this.getComponent('prev_page_btn');

            if (this.controller.isFirstPageActive()) {
                prev_page_btn.setState(true);
                prev_page_btn.disable();
            } else if (this.controller.isLastPageActive()) {
                next_page_btn.setState(true);
                next_page_btn.disable();
            } else {
                prev_page_btn.setState(false);
                prev_page_btn.enable();
                next_page_btn.setState(false);
                next_page_btn.enable();
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.MobileTutorialView = MobileTutorialView;
}());