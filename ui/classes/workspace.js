function Workspace($el) {
    this.$el = $el;
    return this;
}

$.extend(Workspace.prototype, {
    append: function(content) {
        this.dom().append(content.dom());
    },
    dom: function() {
        return this.$el;
    }
});