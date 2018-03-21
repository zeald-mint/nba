function Player(name, position, points) {
    this.name = name;
    this.position = position;
    this.points = points;
    this.template = new Template('template-player');
    this.$el = this.assemble();
}

$.extend(Player.prototype, {
    assemble: function() {
        return this.template.
        assign({
            'player-name': this.name,
            'position': this.position,
            'points': this.points
        }).
        assemble();
    },
    addToTeam: function(team) {
        team.addPlayer(this);
    },
    dom: function() {
        return this.$el;
    }

});