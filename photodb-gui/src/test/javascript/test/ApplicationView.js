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

define(['view/ApplicationView', 'ApplicationChannel', 'util/Obj'], function (ApplicationView, channel, obj) {

    describe('ApplicationView test', function () {

        // Saving the 'window.setTimeout' function
        var originalSetTimeout = window.setTimeout;

        beforeEach(function () {
            channel.unbindAll();
        });

        afterEach(function () {
            // Set the original setTimeout back
            window.setTimeout = originalSetTimeout;
            channel.unbindAll();
        });

        it('should show test the "ApplicationView" events', function () {
            window.setTimeout = function (callback) {
                callback();
            };
            var callbacks = {};
            var windowMock = {
                on: function (key, callback) {
                    // getting the callback functions
                    callbacks[key] = callback;
                },
                outerHeight: function () {
                    return 10;
                },
                outerWidth: function () {
                    return 20;
                }
            }
            ApplicationView.newObject({
                browserWindow: windowMock
            });

            var containerResizedExecuted = false;
            channel.bind('ui-actions', 'container-resized', function (data) {
                expect(data.containerHeight).toBe(10);
                expect(data.containerWidth).toBe(20);
                containerResizedExecuted = true;
            });
            // Triggering the window "onresize" event
            callbacks.resize();
            expect(containerResizedExecuted).toBe(true);

            var eventName = null;
            channel.bind('ui-actions', 'window-alt-released', function () {
                eventName = 'window-alt-released';
            });
            channel.bind('ui-actions', 'window-ctrl-released', function () {
                eventName = 'window-ctrl-released';
            });
            channel.bind('ui-actions', 'window-shift-released', function () {
                eventName = 'window-shift-released';
            });

            var preventDefaultExecuted = false;
            var preventDefault = function () {
                preventDefaultExecuted = true;
            };

            var testOnEvent = function (expectedEventName, eventCallbackName, code, extra) {
                preventDefaultExecuted = false;
                eventName = null;
                var myEvent = {
                    preventDefault: preventDefault,
                    keyCode: code
                };
                if (extra) {
                    obj.forEachKey(extra, function (key, value) {
                        myEvent[key] = value;
                    });
                }
                // Triggering the window "onkeyup" event
                callbacks[eventCallbackName](myEvent);
                expect(eventName).toEqual(expectedEventName);
                expect(preventDefaultExecuted).toBe(true);
            };

            testOnEvent('window-alt-released', 'keyup', 18, {});
            testOnEvent('window-ctrl-released', 'keyup', 17, {});
            testOnEvent('window-shift-released', 'keyup', 16, {});

            channel.unbind('ui-actions', 'window-shift-released');

            preventDefaultExecuted = false;
            callbacks.keyup({
                preventDefault: preventDefault,
                keyCode: 16
            });
            expect(preventDefaultExecuted).toBe(false);

            channel.unbindAll();
            channel.bind('ui-actions', 'window-alt-1-pressed', function () {
                eventName = 'window-alt-1-pressed';
            });
            channel.bind('ui-actions', 'window-alt-ctrl-2-pressed', function () {
                eventName = 'window-alt-ctrl-2-pressed';
            });

            testOnEvent('window-alt-1-pressed', 'keydown', 1, {
                altKey: true
            });
            testOnEvent('window-alt-ctrl-2-pressed', 'keydown', 2, {
                altKey: true,
                ctrlKey: true
            });
        });
    });
});