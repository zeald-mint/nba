function Core (controller) {
    this.controller = controller;
}

$.extend(Core.prototype, {

    retrieve: function(id, callback) {
        var route = this.controller + '/' + id;
        this.execute(route, function(record) {
            $.each(record, function(key, value) {
                this[key] = value;
            }.bind(this));
            callback(record);
        }.bind(this));
    },

    retrieve_all: function(callback) {
        var route = this.controller + '/';
        return this.execute(route, callback);
    },

    update: function(id, data, callback) {
        var route = this.controller + '/' + id;
        return this.execute(route, data, callback);
    },

    insert: function(data, callback) {
        var route = this.controller + '/';
        return this.execute(route, data, callback);
    },

    /**
     * Execute a call to the api & pass returned data to a callback
     * @param route the route to execute on the api
     * @param data an optional object of key => value pairs to pass to the api as POST data
     * @param callback an optional function to execute when the API call returns
     * @example
     * this.execute('summary', function(result) {
     *  console.log('api GET returned: ', result);
     * });
     * this.execute('save', {name: 'Peter'}, function(result) {
     *  console.log('api POST returned: ', result);
     * });
     * this.execute('delete', {name: 'Peter'});
     */
    execute: function (route, data, callback) {
        this.apiURL = '/nba/';
        if (!this.controller) {
            throw new Error ('No controller set');
        }

        // allow data to be optional - if only 2 parameters are passed
        // assume the last parameter is always a callback
        if (typeof callback == 'undefined') {
            callback = data;
            data = {};
        }

        // execute the call & pass returned data to the specified callback
        $.ajax({
            url: this.apiURL + route,
            method: data ? 'GET' : 'POST',
            data: data,
        }).done((data) => {
            if (!callback) {
                return;
            }
            if (typeof data == 'string') {
                data = $.parseJSON(data);
            }
            callback(data);
        });
    }
});
