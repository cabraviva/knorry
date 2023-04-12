/* START TYPES */

/**
 * Response from a http request, which is an object containing the $res property
 */
interface JSONObject {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    [key: string | number | symbol]: any
}

/**
 * Response from a http request. Acts & can be used like a number including the data
 */
interface NumberResponse extends Number, KnorryResponseObj {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again. Also thruthy & falsy will work again
     */
    plain(): string
}

/**
 * Response from a http request. Acts & can be used like a string including the data
 */
interface ArrayResponse extends Array<any> {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again
     */
    plain(): string
}

/**
 * This will be returned if the response Content-Type was set to application/json
 * It indicates that any valid JSON value will be returned
 * The $res property will be available to access the full response
 * If undefined no $res property will be available
 */
type JSONData = PlainTextResponse | JSONObject | NumberResponse | undefined | ArrayResponse

interface KnorryResponseObj {
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
    successfull: boolean
}

interface AnyObject {
    [key: string | number | symbol]: any
}

/**
 * Response from a http request. Acts & can be used like a string including the data
 */
interface PlainTextResponse extends String, KnorryResponseObj {
    /**
     * This will include the complete response without pretending to be a different type
     */
    $res: KnorryResponseObj,
    /**
     * Returns the plain response so the typeof operator works again
     */
    plain(): string
}

interface GlobalThis extends Global, Window {
    __knorry__: {
        options: RequestOptions
    }
}

/**
 * Response from a http request. Can either be a string or any valid JSON type
 */
type KnorryResponse = PlainTextResponse | JSONObject | NumberResponse | undefined | ArrayResponse

type RequestData = URLSearchParams | Blob | FormData | Object | null | undefined | string | boolean | number

/**
 * Here you can provide request options including headers.
 * If you want to set some options globally, use defineKnorryOptions({ ... })
 */
interface RequestOptions {
    /**
     * Gives knorry a hint on which type of data you want to send.
     * Not necessary but recommended.
     * If data is a plain Object and no instance of FormData, URLSearchParams or
     * Blob this is required
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
}

type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH' | 'CONNECT' | 'TRACE'

/* END TYPES */

/* @__PURE__ */ function createKnorryResponse (obj: KnorryResponseObj): KnorryResponse {
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
    } else {
        // Object or Array
        ret = obj.data
        ret.$res = obj
    }

    return ret
}

/* @__PURE__ */ function parseResponseHeaders(headersString: string): Record<string, string> {
    const headers: Record<string, string> = {}
    if (!headersString.trim()) {
        return headers;
    }
    headersString.trim().split('\r\n').forEach((header) => {
        const index = header.indexOf(':')
        const key = header.substring(0, index).trim().toLowerCase()
        const value = header.substring(index + 1).trim()
        headers[key] = value
    })
    return headers
}

/* @__PURE__ */ function execXHR(method: HTTPMethod, sendData: boolean, url: string, options?: RequestOptions, data?: RequestData): Promise<KnorryResponse> {
    return new Promise(function (resolve, promiseReject) {
        // Merge options
        options = mergeObject(namespace().__knorry__.options, options || {})

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
                var contentType: string = 'text/plain'
                // TODO: Detect Content Type
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
                        // @ts-expect-error
                        finalData = data
                    } else {
                        if (typeof data === 'number' || typeof data === 'boolean') data = JSON.stringify(data)
                        if (typeof data === 'object' && !(data instanceof FormData || data instanceof URLSearchParams || data instanceof Blob)) {
                            if (typeof options.dataType === 'string') {

                            }
                        }
                        // @ts-expect-error
                        finalData = data
                        if (finalData instanceof Blob) {
                            if (finalData.type) contentType = finalData.type
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
                                data.append(__a_key, oldData[__a_key])
                            }
                            // @ts-expect-error
                            finalData = data
                        } else if (options.dataType === 'json') {
                            finalData = JSON.stringify(data)
                        } else if (options.dataType === 'urlencoded') {
                            // @ts-expect-error
                            finalData = new URLSearchParams(data)
                        } else {
                            finalData = data.toString()
                        }
                    } else {
                        if (!(data instanceof FormData || data instanceof URLSearchParams || data instanceof Blob)) {
                            return reject(new Error('options.dataType must be set'))
                        } else {
                            // No hint, but instanceof supported type
                            finalData = data
                            if (finalData instanceof Blob) {
                                if (finalData.type) contentType = finalData.type
                            }
                        }
                    }
                }
                if (typeof data === 'number' || typeof data === 'boolean') data = JSON.stringify(data)
                xhr.setRequestHeader('Content-Type', contentType)
            }
        }

        var response: KnorryResponse

        // Load event
        xhr.addEventListener('load', function () {
            // XHR was successfull
            // Parse headers
            const respHeaders = parseResponseHeaders(xhr.getAllResponseHeaders())

            // Content-Type specific data
            var data: any = xhr.responseText
            if (respHeaders['content-type'] && respHeaders['content-type'] === 'application/json') {
                try {
                    data = JSON.parse(data)
                } catch (_) { }
            }


            // Create response
            response = createKnorryResponse({
                knorryError: false,
                data,
                headers: respHeaders,
                status: xhr.status,
                statusText: xhr.statusText,
                serverError: xhr.status >= 500 && xhr.status < 600,
                successfull: xhr.status >= 200 && xhr.status < 300,
                clientError: xhr.status >= 400 && xhr.status < 500
            })

            resolve(response)
        })

        // Open request
        xhr.open(method, url, true, (options.auth || {}).username, (options.auth || {}).password)

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

/* @__PURE__ */ function get (url: string, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('GET', false, url, options)
}

/* @__PURE__ */ function post (url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return execXHR('GET', true, url, options, data)
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
export default /* @__PURE__ */ async function knorry(method: HTTPMethod, url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return new Promise(function(resolve, reject) {
        switch (method.toUpperCase()) {
            case 'GET':
                get(url, options).then(resolve).catch(reject)
            case 'POST':
                post(url, data, options).then(resolve).catch(reject)
            case 'HEAD':
                break
            case 'OPTIONS':
                break
            case 'PUT':
                break
            case 'DELETE':
                break
            case 'PATCH':
                break
            case 'CONNECT':
                break
            case 'TRACE':
                break
            default:
                throw new TypeError('method must be a valid HTTPMethod')
                break
        }
        return resolve(createKnorryResponse({
            knorryError: false,
            errorMsg: 'Invalid Method',
            data: 'See errorMsg!',
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            serverError: false,
            clientError: false,
            successfull: false
        }))
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

function useFetch (fetchFunction: Function): void {
    function XHR () {
        // TODO: Create a wrapper for XHR that uses fetch
    }
    
    defineKnorryOptions({
        XHRClass: XHR
    })
}

export {
    /* @__PURE__ */ get,
    /* @__PURE__ */ post,
    defineKnorryOptions,
    useFetch,
    /* @__PURE__ */ knorry
}