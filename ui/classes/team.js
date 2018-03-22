function Team(name, rosterData) {
    this.controller = 'team';
    this.template = new Template('template-team');
    this.fields = [ 'TeamId', 'TeamName'];
}

// set this object to inherit from core
Team.prototype = Object.create(Core.prototype);
Team.prototype.constructor = Team;

$.extend(Team.prototype, {
    // assigns the data to the template
    assemble: function() {
        this.$el = this.template.
            assign({
                'team-name': this.TeamName,
            }).
            assemble();
        return this;    
    },
    appendTo: function (workspace) {
        workspace.append(this);
        return this;
    },
    dom: function() {
        return this.$el;
    },
    addPlayer: function (player) {
        this.roster.push(player);
        this.assembleRoster();
    },
    assembleRoster: function() {
        var $players = this.template.retrieve('players');
        $players.empty();
        $.each(this.roster, (index, player) => {
            player.dom().appendTo($players);
    });
    }

});