/* START TYPES */

/**
 * Response from a http request, which is an object containing the $res property

 */
export interface JSONObject {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response data
     */
    $plain(): object
    [key: string | number | symbol]: any
}

/**
 * Response from a http request. Acts & can be used like a number including the data

 */
export interface NumberResponse extends Number, KnorryResponseObj {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again. Also thruthy & falsy will work again
     */
    $plain(): number
}

/**
 * Response from a http request. Acts & can be used like an array including the data

 */
export interface ArrayResponse extends Array<any> {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again
     */
    $plain(): any[]
}

/**
 * This will be returned if the response Content-Type was set to application/json
 * It indicates that any valid JSON value will be returned
 * The $res property will be available to access the full response
 * If undefined no $res property will be available

 */
export type JSONData = PlainTextResponse | JSONObject | NumberResponse | undefined | ArrayResponse

/**

 */
export interface KnorryResponseObj {
    /**
     * Specifies if there was an error produced by the client (knorry)
     */
    knorryError: boolean,

    /**
     * If an error occured, this will be the error message
     */
    errorMsg?: string,

    /**
     * The body of the response
     */
    data: string | JSONData,

    status: number,
    statusText: string,

    /**
     * Will be true if status code is between 500 and 599
     */
    serverError: boolean,

    /**
     * Will be true if status code is between 400 and 499
     */
    clientError: boolean,

    /**
     * Response headers in lowercase
     */
    headers: {
        'cache-control'?: string,
        'content-length'?: string,
        'content-type'?: string,
        'date'?: string,
        'server'?: string,
        [key: string]: string | undefined
    },

    /**
     * Represents wether the status code indicates that the request was successful or not.
     * NOTE: This won't always be true if a knorryError occured
     */
    successful: boolean
}

interface AnyObject {
    [key: string | number | symbol]: any
}

/**
 * Response from a http request. Acts & can be used like a string including the data

 */
export interface PlainTextResponse extends String, KnorryResponseObj {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again
     */
    $plain(): string
}

/**
 * Response from a http request. Acts & can be used like a boolean including the data

 */
export interface BooleanResponse extends Boolean, KnorryResponseObj {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again
     */
    $plain(): boolean
}

interface GlobalThis extends Global, Window {
    __knorry__: {
        options: RequestOptions
    }
}

/**
 * Response from a http request. Can either be a string or any valid JSON type

 */
export type KnorryResponse = KnorryResponseObj | PlainTextResponse | JSONObject | NumberResponse | undefined | ArrayResponse | BooleanResponse

/**

 */
export type RequestData = URLSearchParams | Blob | FormData | Object | null | undefined | string | boolean | number

/**
 * Here you can provide request options including headers.
 * If you want to set some options globally, use defineKnorryOptions({ ... })

 */
export interface RequestOptions {
    /**
     * Gives knorry a hint on which type of data you want to send.
     * Not necessary but recommended.
     * If data is a plain Object and no instance of FormData, URLSearchParams or
     * Blob this will default to 'json'
     * @default 'text'
     */
    dataType?: 'json' | 'text' | 'formdata' | 'urlencoded'

    /**
     * Provide you headers here
     * NOTE: Header don't use camelcase, you might have to use quotes like in this example:
     * @example {
     *      'Content-Type': 'application/json'
     * }
     */
    headers?: {
        [key: string]: string
    },
    /**
     * Specifies the timeout for the request in ms
     * When set to 0 or undefined no timeout will be used
     */
    timeout?: number,
    /**
     * You can optionally provide a XHRClass, which can be useful when using node.js
     * @default XMLHttpRequest
     */
    XHRClass?: XMLHttpRequest | Function,

    /**
     * This gives you the option to change
     * the XHR before send
     * @param {XMLHttpRequest} xhr The original XHR
     * @returns {XMLHttpRequest} The modfied XHR or void
     */
    beforeSend?(xhr: XMLHttpRequest): XMLHttpRequest | void,

    /**
     * Optional function which gets called everytime fetching progress was made
     * @param percentage A number ranging from 0 to 1 telling you what percentage of the request was already loaded
     */
    onProgress?(percentage: number): void,

    /**
     * If you want to, you can define an error handler here.
     * If a error handler is defined in the options, your promise won't reject anymore
     * @param err The error that occured
     * @param resolve Gives you the option to resolve the promise with a specified value
     */
    errorHandler?(err: any, resolve: Function): void,

    /**
     * States wether credentials should bei included or not
     * @default true
     */
    withCredentials?: boolean,

    /**
     * If you want to use http authentification, provide your details here
     */
    auth?: {
        username?: string | null,
        password?: string | null
    },

    /**
     * Here you can optionally provide event handlers fo file uploads
     */
    upload?: {
        /**
         * An event handler function which is called at the beginning of a file upload
         * @param total Total file size in bytes
         */
        start?(total: number): void,
        /**
         * An event handler function which is called everytime upload progress was made
         * @param percentage A number between 0 and 1 indicating how much progress was already made
         * @param loaded Already uploaded bytes
         * @param total Total file size in bytes
         */
        progress?(percentage: number, loaded: number, total: number): void,
        /**
         * An event handler function which is called at the end of a file upload
         * @param success Indicates whether the upload was sucessful or not
         */
        end?(success: boolean): void
    },

    /**
     * Indicates wether the response should be an response object or an extended primitive type
     * @default true
     */
    easyMode?: boolean
}

/**

 */
export type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH'

/* END TYPES */

/* @__PURE__ */ function createKnorryResponse (obj: KnorryResponseObj, easyMode: boolean): KnorryResponse {
    if (easyMode) {
        // @ts-expect-error
        var ret: KnorryResponse = { $res: obj }

        if (typeof obj.data === 'undefined') {
            return undefined
        } else if (typeof obj.data === 'string') {
            // @ts-expect-error: Properties will be added below
            ret = new String(obj.data)
            var keys: Array<any> = Object.keys(obj)
            for (var i: number = 0; i < keys.length; i += 1) {
                // @ts-expect-error: We will write to the string anyways
                ret[keys[i]] = obj[keys[i]]
            }
            // @ts-expect-error No worries, it won't be undefined
            ret.$res = obj
        } else if (typeof obj.data === 'number') {
            // @ts-expect-error: Properties will be added below
            ret = new Number(obj.data)
            var keys: Array<any> = Object.keys(obj)
            for (var i: number = 0; i < keys.length; i += 1) {
                // @ts-expect-error: We will write to the number anyways
                ret[keys[i]] = obj[keys[i]]
            }
            // @ts-expect-error No worries, it won't be undefined
            ret.$res = obj
        } else if (typeof obj.data === 'boolean') {
            // @ts-expect-error: Properties will be added below
            ret = new Boolean(obj.data)
            var keys: Array<any> = Object.keys(obj)
            for (var i: number = 0; i < keys.length; i += 1) {
                // @ts-expect-error: We will write to it anyways
                ret[keys[i]] = obj[keys[i]]
            }
            // @ts-expect-error No worries, it won't be undefined
            ret.$res = obj
        } else {
            // Object or Array
            ret = obj.data
            // @ts-expect-error
            ret.$res = obj
        }

        // @ts-expect-error: It's not
        ret.$plain = function () {
            return obj.data
        }

        return ret
    } else {
        // @ts-expect-error
        obj.$plain = function () {
            return obj.data
        }
        return obj
    }
}

/* @__PURE__ */ function parseResponseHeaders(headersString: string): Record<string, string> {
    const headers: Record<string, string> = {}
    if (!headersString.trim()) {
        return headers;
    }
    headersString.trim().split('\r\n').forEach(function (header) {
        const index = header.indexOf(':')
        const key = header.substring(0, index).trim().toLowerCase()
        const value = header.substring(index + 1).trim()
        headers[key] = value
    })
    return headers
}

/* @__PURE__ */ function execXHR(method: HTTPMethod, sendData: boolean, url: string, options?: RequestOptions, data?: RequestData): Promise<KnorryResponse> {
    var Blib
    try {
        // @ts-expect-error
        Blib = Blob || function () {}
    } catch (_) {
        Blib = function () {}
    }
    // @ts-expect-error
    var Blob: Blob = Blib
    
    return new Promise(function (resolve, promiseReject) {
        // Merge options
        options = mergeObject((namespace().__knorry__ || {}).options || {}, options || {})

        var reject: Function
        if (typeof options.errorHandler === 'function') {
            reject = function (reason: any): void {
                // @ts-expect-error: I already checked above
                options.errorHandler(reason, resolve)
            }
        } else {
            reject = promiseReject
        }

        // @ts-expect-error: Yes it is
        var xhr: XMLHttpRequest = new (options.XHRClass || XMLHttpRequest)()

        // Listen for errors:
        xhr.addEventListener('abort', function () {
            return reject(new Error('[Knorry] Request ' + url + ' was aborted!'))
        })
        xhr.addEventListener('error', function () {
            return reject(new Error('[Knorry] Request ' + url + ' failed!'))
        })
        xhr.addEventListener('timeout', function () {
            return reject(new Error('[Knorry] Timeout error on request ' + url))
        })
        // Progress handler
        if (typeof options.onProgress === 'function') {
            xhr.addEventListener('progress', function (ev: any) {
                if (ev.lengthComputable) {
                    // @ts-expect-error: No it is not undefined anymore :D
                    options.onProgress(ev.loaded / ev.total)
                }
            })
        }
        // Set properties
        xhr.timeout = options.timeout || 0
        if (typeof options.withCredentials !== 'boolean') {
            options.withCredentials = true
        }
        xhr.withCredentials = options.withCredentials

        var response: KnorryResponse

        // Load event
        xhr.addEventListener('load', function () {
            // XHR was successful
            // Parse headers
            const respHeaders = parseResponseHeaders(xhr.getAllResponseHeaders())

            // Content-Type specific data
            var data: any = xhr.responseText
            if (respHeaders['content-type'] && respHeaders['content-type'].includes('application/json')) {
                try {
                    data = JSON.parse(data)
                } catch (_) { }
            }


            // Create response
            var em = true
            if (typeof (options || {}).easyMode === 'boolean') {
                // @ts-expect-error
                em = (options || {}).easyMode
            }

            response = createKnorryResponse({
                knorryError: false,
                data,
                headers: respHeaders,
                status: xhr.status,
                statusText: xhr.statusText,
                serverError: xhr.status >= 500 && xhr.status < 600,
                successful: xhr.status >= 200 && xhr.status < 300,
                clientError: xhr.status >= 400 && xhr.status < 500
            }, em)

            resolve(response)
        })

        // Upload API
        if (typeof options.upload === 'object') {
            if (typeof options.upload.start === 'function') {
                xhr.upload.addEventListener('loadstart', (ev) => {
                    if (ev.lengthComputable) {
                        // @ts-expect-error: No it's not
                        options.upload.start(ev.total)
                    }
                })
            }

            if (typeof options.upload.progress === 'function') {
                xhr.upload.addEventListener('progress', (ev) => {
                    if (ev.lengthComputable) {
                        // @ts-expect-error: No it's not
                        options.upload.progress(ev.loaded / ev.total, ev.loaded, ev.total)
                    }
                })
            }

            if (typeof options.upload.end === 'function') {
                xhr.upload.addEventListener('loadend', (ev) => {
                    // @ts-expect-error: No it's not
                    options.upload.end(ev.loaded !== 0)
                })
            }
        }

        // Open request
        xhr.open(method, url, true)

        let lbtoa
        try {
            lbtoa = btoa
        } catch (_) {
            lbtoa = function (str: string) {
                return Buffer.from(str).toString('base64')
            }
        }

        // HTTP Basic Auth
        if (options.auth && typeof options.auth === 'object' && typeof options.auth.username === 'string' && typeof options.auth.password === 'string') {
            const encodedCredentials = lbtoa(`${options.auth.username}:${options.auth.password}`)
            xhr.setRequestHeader('Authorization', 'Basic ' + encodedCredentials)
        }

        // Headers
        var headers = options.headers || {}
        var headerNames = Object.keys(headers)
        for (var i = 0; i <= headerNames.length; i += 1) {
            xhr.setRequestHeader(headerNames[i], headers[headerNames[i]])
        }

        // Content-Type header
        var finalData: URLSearchParams | Blob | FormData | string | undefined | null = undefined
        if (sendData) {
            if (typeof data !== 'undefined' && data !== null) {
                // debugger // Used to debug content type resolving
                var contentType: string = 'text/plain'
                if (typeof (options.headers || {})['content-type'] === 'string') {
                    contentType = (options.headers || { 'content-type': 'text/plain' })['content-type']
                    if (contentType === 'application/json') {
                        finalData = JSON.stringify(data)
                    } else if (contentType === 'application/x-www-form-urlencoded') {
                        if (typeof data === 'object' || typeof data === 'string') {
                            // @ts-expect-error
                            finalData = new URLSearchParams(data)
                        }
                        // @ts-expect-error
                        finalData = data
                    } else if (contentType === 'multipart/form-data') {
                        if (!(data instanceof FormData)) {
                            // Create form data
                            if (typeof data !== 'object') return reject(new TypeError('To create FormData from scratch, please pass an object as data!'))
                            var oldData = data
                            data = new FormData()
                            var __a_keys = Object.keys(oldData)
                            for (var i = 0; i < __a_keys.length; i += 1) {
                                var __a_key = __a_keys[i]
                                // @ts-expect-error
                                data.append(__a_key, oldData[__a_key])
                            }
                        }
                        contentType = 'multipart/form-data'
                        // @ts-expect-error
                        finalData = data
                    } else {
                        if (typeof data === 'number' || typeof data === 'boolean') {
                            data = JSON.stringify(data)
                        }
                        if (typeof data === 'object' && !(data instanceof FormData || data instanceof URLSearchParams || data instanceof Blob)) {
                            if (typeof options.dataType === 'string') {
                                
                            }
                        }
                        // @ts-expect-error
                        finalData = data
                        if (finalData instanceof Blob) {
                            if (finalData.type) contentType = finalData.type
                        } else if (finalData instanceof URLSearchParams) {
                            contentType = 'application/x-www-form-urlencoded'
                        } else {
                            contentType = 'multipart/form-data'
                        }
                    }
                } else {
                    if (typeof options.dataType === 'string') {
                        if (options.dataType === 'formdata') {
                            if (typeof data !== 'object') return reject(new TypeError('To create FormData from scratch, please pass an object as data!'))
                            var _oldData = data
                            data = new FormData()
                            var __a_keys = Object.keys(_oldData)
                            for (var i = 0; i < __a_keys.length; i += 1) {
                                var __a_key = __a_keys[i]
                                // @ts-expect-error
                                data.append(__a_key, _oldData[__a_key])
                            }
                            contentType = 'multipart/form-data'
                            // @ts-expect-error
                            finalData = data
                            contentType = 'multipart/form-data'
                        } else if (options.dataType === 'json') {
                            contentType = 'application/json; charset=utf8'
                            finalData = JSON.stringify(data)
                        } else if (options.dataType === 'urlencoded') {
                            contentType = 'application/x-www-form-urlencoded'
                            // @ts-expect-error
                            finalData = new URLSearchParams(data)
                        } else {
                            finalData = data.toString()
                        }
                    } else {
                        if (!(data instanceof FormData || data instanceof URLSearchParams || data instanceof Blob)) {
                            if (typeof data === 'object') {
                                finalData = JSON.stringify(data)
                                contentType = 'application/json; charset=utf8'
                            } else {
                                // @ts-expect-error
                                finalData = data
                                contentType = 'text/plain; charset=utf8'
                            }
                        } else {
                            // No hint, but instanceof supported type
                            finalData = data
                            if (finalData instanceof Blob) {
                                if (finalData.type) contentType = finalData.type
                            } else if (finalData instanceof URLSearchParams) {
                                contentType = 'application/x-www-form-urlencoded'
                            } else {
                                contentType = 'multipart/form-data'
                            }
                        }
                    }
                }
                if (typeof data === 'number' || typeof data === 'boolean') {
                    data = JSON.stringify(data)
                    contentType = 'application/json; charset=utf8'
                }
                
                if (contentType !== 'multipart/form-data') xhr.setRequestHeader('Content-Type', contentType)
            }
        }

        // Before send
        if (typeof options.beforeSend === 'function') {
            var cachedXHR = xhr
            xhr = options.beforeSend(xhr) || cachedXHR
        }

        // Send request
        if (sendData) {
            xhr.send(finalData)
        } else {
            xhr.send()
        }

    })
}

/**
 * Makes a get request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function get (url: string, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('GET', false, url, options)
}

/**
 * Makes a head request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function head (url: string, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('HEAD' , false, url, options)
}

/**
 * Makes a delete request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function del(url: string, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('DELETE', false, url, options)
}

/**
 * Makes a post request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestData} data - The data to be sent in the request body when using a method like POST
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function post (url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('POST', true, url, options, data)
}

/**
 * Makes a put request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestData} data - The data to be sent in the request body when using a method like POST
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function put (url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('PUT', true, url, options, data)
}

/**
 * Makes a options request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestData} data - The data to be sent in the request body when using a method like POST
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function options(url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('PUT', true, url, options, data)
}

var _options = options

/**
 * Makes a patch request to the specified url
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestData} data - The data to be sent in the request body when using a method like POST
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
function patch(url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('PUT', true, url, options, data)
}

/**
 * Makes a request to the specified url
 * @param {HTTPMethod} method - The HTTP method to use for the request (e.g. GET, POST, PUT, DELETE,
 * etc.).
 * @param {string} url - The URL to which the HTTP request will be sent.
 * @param {RequestData} data - The data to be sent in the request body when using a method like POST
 * @param {RequestOptions} options - An optional object containing additional options for the
 * request, such as headers
 * @returns A Promise that resolves either with a primitive type containing the full response as the $res property or undefined
 */
export default async function knorry(method: HTTPMethod, url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return new Promise(function(resolve, reject) {
        switch (method.toUpperCase()) {
            case 'GET':
                get(url, options).then(resolve).catch(reject)
                break
            case 'POST':
                post(url, data, options).then(resolve).catch(reject)
                break
            case 'HEAD':
                head(url, options).then(resolve).catch(reject)
                break
            case 'OPTIONS':
                _options(url, data, options).then(resolve).catch(reject)
                break
            case 'PUT':
                put(url, data, options).then(resolve).catch(reject)
                break
            case 'DELETE':
                del(url, options).then(resolve).catch(reject)
                break
            case 'PATCH':
                patch(url, data, options).then(resolve).catch(reject)
                break
            default:
                throw new TypeError('method must be a valid HTTPMethod')
        }
    })
}

/**
 * Merges two object
 * Behaviour specific: Properties on other will replace properties on base
 */
/* @__PURE__ */ function mergeObject (base: object, other: object): object {
    var newObj: AnyObject = {}

    var keysBase: Array<any> = Object.keys(base)
    for (var i: number = 0; i < keysBase.length; i += 1) {
        // @ts-expect-error It works though
        newObj[keysBase[i]] = base[keysBase[i]]
    }

    var keysOther: Array<any> = Object.keys(other)
    for (var i: number = 0; i < keysOther.length; i += 1) {
        // @ts-expect-error It works though
        newObj[keysOther[i]] = other[keysOther[i]]
    }

    return newObj
}

/* @__PURE__ */ function namespace (): GlobalThis {
    var glb: GlobalThis
    try {
        // @ts-expect-error: FU TypeScript, there's nothing wrong here
        glb = global
    } catch (_) {
        // @ts-expect-error: FU TypeScript, there's nothing wrong here
        glb = window
    }
    return glb
}

function defineKnorryOptions (options: RequestOptions): void {
    var glb = namespace()

    if (!glb.__knorry__) glb.__knorry__ = {
        options: {}
    }
    glb.__knorry__.options = mergeObject(glb.__knorry__.options, options)
}

export {
    get,
    post,
    put,
    head,
    del,
    options,
    patch,
    defineKnorryOptions,
    knorry
}