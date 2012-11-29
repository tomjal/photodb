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
 */

"use strict";
(function () {
    var files = [
        'application',
        'application-growl',
        'application-growl-message'
    ];

    define((function () {
        var requirements = [];
        for (var i = 0; i < files.length; i++) {
            requirements.push('text!templates/' + files[i] + '.handlebars');
        }
        requirements.push('lib/handlebars');
        return requirements;
    })(), function () {
            var templates = {};
            for (var i = 0; i < files.length; i++) {
                templates[files[i]] = Handlebars.compile(arguments[i]);
            }
            return {
                getValue:function (templateName, cfg) {
                    var template = templates[templateName];
                    if (!template) {
                        throw 'Template not registered. "' + templateName + '"';
                    }
                    return template(cfg);
                }
            };
        }
    );
})();

