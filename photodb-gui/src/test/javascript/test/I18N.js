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

define(['util/I18N'], function (I18N) {
    describe('I18N test', function () {
        it('should show the welcome message', function () {
            var str = I18N.get('application.welcome', {
                appName:I18N.get('application.name'),
                userName:'my Master'
            });
            expect(str).toEqual('Hi my Master! Welcome to photodb!');
        });

        it('should alert a missing key', function () {
            var str = I18N.get('missing');
            expect(str).toEqual('[!missing!]');
        });
    });
});
