#!/usr/bin/env node

'use strict';

var CommandAsker    = require('command-asker'),
    cli             = require('../helper/console'),
    userHelper      = require('../helper/user'),
    User            = require('../model/index').User;

cli.banner();
cli.ok('Interactive command to add new user');
cli.line();

var a = new CommandAsker([
    {key: 'email',         ask: 'email',           validators: []},
    {key: 'password',      ask: 'password',        validators: []},
    {key: 'username',      ask: 'username',        validators: []},
    {key: 'displayName',   ask: 'display name',    validators: []},
    {key: 'bio',           ask: 'bio',             validators: []},
    {key: 'location',      ask: 'location',        validators: []}
]);

a.ask(function(response) {
    var plainPassword = response.password;
    response.password = userHelper.generateHash(response.password);

    User.create(response).then(function(createdUser) {
            cli.line();
            cli.line(
                cli.colorOk('The user ') + cli.colorHighlightOk(createdUser.email) +
                cli.colorOk(' has been registered with ') + cli.colorHighlightOk(plainPassword) +
                cli.colorOk(' password.')
            );
            cli.ok('Thanks.');
            a.close();
        }, function() {
            cli.line();
            cli.error('An error occured during saving ...');
            a.close(1);
        });
});
