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

(function () {
    'use strict';

    var deps = ['app/js/templates', 'app/js/i18n', 'lib/backbone'];
    define(deps, function (templates) {

        var FileDetailsView = Backbone.View.extend({
            el: function () {
                return $('<div class="modal" tabindex="-1" role="dialog"></div>');
            },
            events: {
                'click .close-modal': function () {
                    var self = this;
                    self.$el.modal('hide');
                }
            },
            render: function () {
                var self = this;

                self.$el.empty();
                var html = templates.getValue('file-details', {
                    src: self.model.get('src'),
                    name: self.model.get('name')
                });
                self.$el.html(html);
                self.$el.bind('hidden', function() {
                    self.remove();
                });

                return self;
            },
            initialize: function () {
                var self = this;
                self.listenTo(this.model, 'destroy', function () {
                    self.remove();
                });
            }
        });

        var FileView = Backbone.View.extend({
            tagName: 'div',
            className: 'photo',

            events: {
                'click': function () {
                    var self = this;
                    self.trigger('photo-clicked', {
                        model: self.model
                    });
                }
            },

            render: function () {
                var self = this;

                self.$el.empty();
                var html = templates.getValue('file', {
                    src: self.model.get('src'),
                    name: self.model.get('name')
                });
                self.$el.html(html);

                return self;
            },
            initialize: function () {
                var self = this;
                self.listenTo(this.model, 'destroy', function () {
                    self.remove();
                });
            }
        });

        return Backbone.View.extend({
            tagName: 'div',
            className: 'photos',
            render: function () {
                var self = this;

                self.$el.empty();
                var html = templates.getValue('files');
                self.$el.html(html);

                var dropZone = self.$('.drop-area')[0];
                dropZone.addEventListener('dragover', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'copy';
                }, false);
                dropZone.addEventListener('drop', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    self.trigger('file-drop', {
                        files: files
                    });
                }, false);

                self.model.forEach(function (fileModel) {
                    self.showFile(fileModel);
                });

                return this;
            },
            showDetails: function (data) {
                var self = this;
                var detailsView = new FileDetailsView({
                    model: data.model
                }).render();
                self.$('.details-area').append(detailsView.el);
                detailsView.$el.modal({});
            },
            showFile: function (fileModel) {
                var self = this;
                var fileView = new FileView({
                    model: fileModel
                }).render();
                self.listenTo(fileView, 'photo-clicked', self.showDetails);
                self.$('.photos-area').prepend(fileView.el);
            },
            initialize: function () {
                var self = this;
                self.listenTo(this.model, 'add', self.showFile);
            }
        });

    });
}());

