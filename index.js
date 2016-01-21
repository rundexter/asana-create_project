var _ = require('lodash'),
    util = require('./util.js'),
    request = require('request').defaults({
        baseUrl: 'https://app.asana.com/api/1.0/'
    }),
    pickInputs = {
        'workspace': { key: 'workspace', validate: { req: true } },
        'team': 'team',
        'notes': 'notes',
        'name': 'name'
    },
    pickOutputs = {
        'id': 'id',
        'notes': 'notes',
        'name': 'name'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('asana').credentials(),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        console.log(credentials);
        // check params.
        if (validateErrors)
            return this.fail(validateErrors);

        //send API request
        request.post({
            uri: 'projects',
            form: inputs,
            oauth: credentials,
            json: true
        }, function (error, responce, body) {
            if (error || (body && body.errors))
                this.fail(error || body.errors);
            else
                this.complete(util.pickOutputs(body, pickOutputs) || {});

        }.bind(this));
    }
};
