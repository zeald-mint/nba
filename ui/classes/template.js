/**
 * Zeald templating class
 */
class Template {

    /**
     * Extract the html from the template into our own DOM placeholder element
     * @param {String} templateId template identifier for the DOM element containing the
     *     template HTML
     * @param {Boolean} clone should we clone the element rather than copying its innerHTML
     * @return {Template} this
     */
    constructor(templateId, clone) {
        this.$template = typeof templateId === 'object' ? $(templateId) : $('#' + templateId);
        if (clone) {
            this.$element = this.$template.clone();
        } else {
            this.$element = $('<div/>').html(this.$template.html());
            this.$element = this.$element.children();
        }

        // we need to map class names to their associated DOM elements for any
        // elements in the template that have a class specified this is because we
        // need to access these later after other templates or DOM elements may have
        // been merged in
        let classMap = {};
        let classElements = this.$element.find('[class]').addBack('[class]'); // includes $this.el in the search
        $.each(classElements, (i, el) => {

            // loop through any class names associated with this element
            $.each(el.className.split(/\s+/), (i, cls) => {

            // if we've already dealt with this class, ignore it
            if (classMap[cls]) {
            return;
        }

        // otherwise map any elements in the template to this class name
        let lookup = '.' + cls;
        classMap[cls] = this.$element.find(lookup).addBack(lookup);
    });
    });
        this.map = classMap;
        return this;
    }

    /** @TODO - allow an array to be assigned to a variable - and if so, create duplicate instances of the variable element
     * Assign data into the template
     * Looks for elements with the specified class name & assigns them the specified value
     * If a value is an object or array, elements will be injected into the specified
     * element instead of set as HTML
     * @param {Object/String} assignments an object of key => value pairs to assign,
     *     or a string key for a single assignment
     * @param {String} optional value if doing a single assignment
     * @return {Template} this
     */
    assign(assignments, value) {

        // single assignment
        if (typeof assignments === 'string') {
            var key = assignments;
            assignments = {};
            assignments[key] = value;
        }

        // loop through each assignment & process it
        $.each(assignments, (key, value) => {
            // let $element = this.$element.find('.' + key);
            const $element = this.retrieve(key);
        if (typeof $element === 'undefined') {
            return; // this.error('Unable to find template element: ' + key);
        }

        // empty the element first as an assign should replace anything already there
        $element.empty();

        // check if we are injecting dom elements, or setting html
        if (typeof value === 'object') {
            $element.append(value);
        } else {
            $element.html(value);
        }
    });
        return this;
    }

    /**
     * Loop through an array of assignments, create an instance of each element
     * identified by key and assign data at each element of the array
     * @param {String} key lookup key
     * @param {Array} assignments an array of data to assign to the cloned elements
     */
    loop(key, assignments) {
        const $element = this.retrieve(key);
        if (!Array.isArray(assignments)) {
            assignments = [assignments];
        }

        // remove the element from the DOM tree & use it as a template
        let $parent = $element.parent();
        if ($parent.length) {

            // store a record of who the parent should be in case we need to find it later
            $element.$originalParent = $parent;
        } else {
            $parent = $element.$originalParent;
        }
        $element.remove();

        // insert a clone of the element for each item in the array
        $.each(assignments, (index, assignment) => {
            const template = new Template($element, true);
        if (typeof assignment !== 'object' && !Array.isArray(assignment)) {
            template.assign(key, assignment);
        } else {
            template.assign(assignment);
        }
        template.assemble().appendTo($parent);
    });
        return this;
    }

    /**
     * Build & return DOM elements for the template
     * @return {Template} this
     */
    assemble() {
        return this.$element;
    }

    /**
     * Retrieves the element(s) associated with a template variable (defined by the class name)
     * Only retrieves template elements as they exist in the defined template - as
     * opposed to findALl which will execute a lookup of the entire DOM tree below
     * this template at the time of execution.
     * @param {String} key optional assignment variable to look up - if not
     *     specified, will return the root node(s) of the template
     * @param {Boolean} reportErrors if true, will throw an error if we can't find
     *     an element defined by the 'key' parameter
     * @return {jQuery} jQuery element or array of elements
     */
    retrieve(key, reportErrors) {
        const $element = typeof key !== 'undefined' ? this.map[key] : this.$element;
        if (reportErrors && !$element) {
            return this.error('Template::retrieve was unable to retrieve element: ' + key);
        }
        return $element;
    }

    /**
     * Provides direct jQuery find on the template elements
     * This will look up the DOM tree at the time of execution, so may find elements
     * of subtemplates or other DOM nodes that have been inserted into the template elements.
     * If you just want the template elements, refer to the `retrieve` method.
     * @param {String} selector to look up in the template DOM elements
     * @return {jQuery} jQuery element or array of elements
     */
    findAll(selector) {
        return this.$element.find(selector);
    }

    /**
     * Append to an element in the template. This method can be called two different
     * ways:
     *   - key, $element - if passing two parameters, $element will be appended
     *      to the element matching the template variable defined by the first parameter
     *   - $element - if passing one parameter, the passed element will be appended
     *      to the root this.$element template element
     * @param {String} key a key if appending to a specific variable
     * @param {jQuery/String} $element jQuery DOM element, or a string to append
     * @return {Template} this
     */
    append(key, $element) {
        if (typeof $element === 'undefined') {
            this.$element = this.$element.add(key);
        } else {
            this.retrieve(key).append($element);
        }
        return this;
    }

    /**
     * Remove an element from the template based off its assignment 'key' / variable name
     * @param {String} key assignment variable to look up
     * @return {jQuery} this
     */
    remove(key) {
        this.retrieve(key).remove();
        return this;
    }

    /**
     * Show an element based off its assignment 'key' / variable name
     * @param {String} key assignment variable to look up
     * @return {jQuery} this
     */
    show(key) {
        this.retrieve(key).show();
        return this;
    }

    /**
     * Hide an element based off its assignment 'key' / variable name
     * @param {String} key assignment variable to look up
     * @return {jQuery} this
     */
    hide(key) {
        this.retrieve(key).hide();
        return this;
    }

    /**
     * Retrieve the value of a form element in the template
     * @param {String} name name of the form element we want the value of
     * @return {String/Mixed} value of the form element
     */
    value(name) {
        return this.findAll('[name=' + name + ']').val(); // @todo - cache this in constructor like class names?
    }

    /**
     * Control a progress bar element
     * If % complete is > than 100% will show a portion of the space as red
     * @param {Float} percent % complete (as a decimal)
     * @param {String} progressName optional class name of the progress bar element (defaults to 'progress')
     * @return {jQuery} this
     */
    progress(percent, progressName) {
        if (typeof progressName === 'undefined') {
            progressName = 'progress';
        }
        // var progress = this.$element.find('.' + progressName);
        var progress = this.retrieve(progressName);
        if (!progress.length) {
            throw new Error(
                'Unable to find progress bar element with class: ' + progressName);
        }
        progress.empty();

        // if over 100%, scale the % number down to base 100, set the progress bar to
        // equivalent of 100%, and the remainder to overage
        percent = Math.round(percent * 100);
        if (percent > 100) {
            percent = Math.round((100 / percent) * 100);

            // add the overage bar
            $('<b/>').
            addClass('over').
            css('width', (100 - percent) + '%').
            appendTo(progress);
        } else {

            // add the available (white) bar in
            $('<b/>').css('width', (100 - percent) + '%').appendTo(progress);
        }
        return this;
    }

    /**
     * Format minutes in hh:mm format
     * @param {Integer} minutes number of minutes to format
     * @return {String} formatted hh:mm string
     */
    formatTime(minutes) {
        let hours = Math.floor(minutes / 60);
        let mins = Math.floor(minutes % 60);
        return hours + ':' + (mins < 10 ? '0' : '') + mins;
    }

    /**
     * If number is defined & greater than 1, return an 's'
     * @param {Integer/Float} number
     * @return {String} empty string or 's'
     */
    plural(number) {
        return number ? 's' : '';
    }

    /**
     * Error handling - throw an error
     * @param {String} message human readable error message
     */
    error(message) {
        throw new Error(message);
        return false;
    }
}