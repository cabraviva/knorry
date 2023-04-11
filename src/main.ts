/* START TYPES */

interface KnorryResponse {
    /**
     * Specifies if there was an error produced by the client (knorry)
     */
    clientError: boolean,
    /**
     * If an error occured, this will be the error message
     */
    errorMsg?: string
}

interface RequestData { }

interface RequestOptions {
    headers?: {
        [key: string]: string
    },
    timeout?: number,
    data?: RequestData
}

type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH' | 'CONNECT' | 'TRACE'

/* END TYPES */

// BASED ON https://github.com/greencoder001/zGET/blob/master/src/main.js

function get (url: string, options?: RequestOptions): Promise<KnorryResponse> {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest()
        resolve({
            clientError: false
        })
    })
}

function post (url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest()
        resolve({
            clientError: false
        })
    })
}

export default async function knorry(method: HTTPMethod, url: string, data?: RequestData, options?: RequestOptions): Promise<KnorryResponse> {
    switch (method.toUpperCase()) {
        case 'GET':
            return await get(url, options)
        case 'POST':
            return await post(url, data, options)
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
    return {
        clientError: false,
        errorMsg: 'Invalid Method'
    }
}

export {
    get,
    post
}