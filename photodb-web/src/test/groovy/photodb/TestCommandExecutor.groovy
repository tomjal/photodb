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

package photodb

import junit.framework.Assert
import org.junit.Test
import photodb.service.ServiceFacade
import photodb.web.command.CommandExecutor

import javax.servlet.ServletRequest
import javax.servlet.ServletResponse

class TestCommandExecutor {

    ServletRequest getReq(Hashtable params) {
        def attr = [:]
        def req = [
                getParameter: {
                    key ->
                    return params[key]
                },
                getParameterNames: {
                    return params.keys()
                },
                setAttribute: {
                    key, value ->
                    attr << [(key): value]
                },
                getAttribute: {
                    key ->
                    return attr[key]
                }
        ] as ServletRequest
        return req
    }

    @Test
    void testSuccess() {
        //Mocking the ServiceFacade
        def serviceFacade = [createPhoto: {
            path, fileName, contentType, x, y -> 100l
        }] as ServiceFacade

        def resp = [] as ServletResponse

        //Creating an executor instance
        def executor = new CommandExecutor()
        def result = executor.execute(serviceFacade, getReq([
                cmdName: 'CreatePhoto',
                path: 'b'
        ] as Hashtable), resp)
        Assert.assertEquals(100l, result.output.photoUid)
    }

    @Test
    void testError() {
        def serviceFacade = [createPhoto: {
            path -> throw new RuntimeException('Expected exception!')
        }] as ServiceFacade

        def resp = [] as ServletResponse

        def executor = new CommandExecutor()
        def result = executor.execute(serviceFacade, getReq([
                cmdName: 'CreatePhoto',
                path: 'b'
        ] as Hashtable), resp)
        Assert.assertEquals(false, result.success)
    }
}