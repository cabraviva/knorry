![Knorry](/logo.jpg)

<center align="center">

![Test](https://img.shields.io/github/actions/workflow/status/greencoder001/knorry/test.yaml?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/knorry?color=bright-green&label=Full%20bundle%20minzipped%3A&style=flat-square)
![GitHub](https://img.shields.io/github/license/greencoder001/knorry?color=bright-green&style=flat-square)
![npm](https://img.shields.io/npm/dw/knorry?style=flat-square)
![npm](https://img.shields.io/npm/v/knorry?label=Version&style=flat-square)

**The most lightweight pure esm browser only http client you could get 🚀**

</center>

# Why?
- 🌳 Tree Shakable
- 🗒️ Type Definitions
- 🏭 Supports most features
- ❌ Doesn't throw errors on requests with non 200 code
- 🪶 As lightweight as possible
- ⚡ Pure ESM
- 📦 Optimized for bundlers
- 🤝 Promise based
- ➡️ Automatically parses JSON
- 👨‍💻 Splendid developer experience
- 🚀 Extremely good [compatibility](/COMPATIBILITY.md) (~98.4%)

# Installation
**With a module bundler:**
```shell
npm i -D knorry
```
No additional configuration required

**Using a CDN (Not recommended):**
```javascript
const knorry = (await import('https://cdn.jsdelivr.net/npm/knorry@latest')).default
```
This method is not recommended because it performs additional requests and doesn't support tree shaking, so even if you only used the get method the bundle stays complete

**When using node (Not recommended):**
```shell
npm i knorry xmlhttprequest form-data urlsearchparams
```
```javascript
const { defineKnorryOptions } = await import('knorry')
const { XMLHttpRequest } = require('xmlhttprequest')
global.FormData = require('form-data')
global.Blob = class Blob {}
global.URLSearchParams = require('urlsearchparams')
defineKnorryOptions({
    XHRClass: XMLHttpRequest
})
```
This method is not recommended because it doesn't supports all features and you aren't in need of a lightweight client in nodejs. Use a more robust client like [axios](https://npmjs.com/package/axios) instead

# Some things to keep in mind when using knorry
## Easy mode
By default knorry will use easy mode, which you can disable like this:
```js
import { defineKnorryOptions, get } from 'knorry'
defineKnorryOptions({
    easyMode: false
})

// Or temporarily disable it for one request
await get('example.com', {
    easyMode: false
})
```
Easy mode will not directly return the response, but rather return the data containing the full response on the $res property. This will work using the constructor of a primitive type like String:
```js
await get('example-api.com') // -> String {'response', $res: ...}
await get('example-api.com', { easyMode: false }) // -> {data: 'response', ...}
```
It is implemented like this because it's much cleaner to write:
```svelte
<!-- Svelte file for demonstration -->
<script>
import { get } from 'knorry'
</script>
<main>
Hello, {await get('/whoami')}
</main>
```
than having to wrap every request in parentheses:
```svelte
<!-- Svelte file for demonstration -->
<script>
import { get, defineKnorryOptions } from 'knorry'
defineKnorryOptions({
    easyMode: false
})
</script>
<main>
Hello, {(await get('/whoami')).data}
</main>
```

However this has some flaws, like equality & type checking. Here are some instructions teaching you what works and what doesn't:
```js
import { get } from 'knorry'

// 💩
await get('/whoami') === 'username'
typeof await get('/whoami') === 'string'
!!await get('/returns-false') // -> true

// 👌
await get('/whoami') == 'username'
await get('/whoami') instanceof String
!!(await get('/returns-false')).$plain() // -> false
```
