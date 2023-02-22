(function() {
    function Dialog(options) {
        this.options = options;
        this.parent = null;
    }

    Dialog.prototype.close = function() {
        $('#confirm_dialog').hide();
        $('#confirm_dialog').appendTo(this.parent);
        this.parent = null;
        return false;
    };

    Dialog.prototype.open = function() {
        if (!$('#confirm_dialog')) {
            alert('Dialog template is missing!');
        }

        if (this.parent) {
            return;
        }

        this.parent = $('#confirm_dialog').parent();

        $('#confirm_dialog_title').text(this.options.title);
        $('#confirm_dialog_text').text(this.options.text);

        var button_yes = $($('#confirm_dialog a')[0]);
        button_yes.off('click');
        button_yes.on("click", this.options.button_yes.callback_function);
        button_yes.find('.middle').text(this.options.button_yes.title);

        var button_no = $($('#confirm_dialog a')[1]);
        button_no.off('click');
        button_no.on("click", this.options.button_no.callback_function);
        button_no.find('.middle').text(this.options.button_no.title);

        $('#confirm_dialog').show();

    };

    window.Dialog = Dialog;
}());