/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 "use strict";
 */

define(['lib/handlebars', 'lib/underscore', 'app/js/log'], function (utils) {
    'use strict';

    var missing = Handlebars.compile('[!{{key}}!]');
    var messages = {
        'application.name': 'photodb',
        'application.welcome': 'Hi {{userName}}! Welcome to {{appName}}!',
        'html.support.error': 'This browser does not fully support HTML5. Try again with another browser.',
        'drag.photos.hint': 'Drag photos to your browser.',
        'photo.upload': 'Uploading file {{fileName}}',
        'photo.delete.tip': 'Files selected. Hit the "delete" key to remove them.',
        'my.photos': 'My Photos',
        'drop.files.area': 'Drop your files here',
        'application.about': 'About'
    };

    _.each(_.keys(messages), function (key) {
        var template = Handlebars.compile(messages[key]);
        messages[key] = template;
    });

    var get = function (key, values) {
        var template = messages[key];
        var cfg = values;
        if (!template) {
            template = missing;
            cfg = {
                key: key
            };
            window.console.error('Missing i18n message.', key);
        }
        return template(cfg);
    };

    Handlebars.registerHelper('i18n', function (key) {
        return get(key);
    });

    return {
        get: get
    };
});
