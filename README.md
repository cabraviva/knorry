# knorry
 The most lightweight pure esm browser only http client you could get 🚀

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
- 🚀 Extremely good backwards [compatibility](https://caniuse.com/es6) (~97%)

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
npm i knorry xmlhttprequest
```
```javascript
const { defineKnorryOptions } = await import('knorry')
const { XMLHttpRequest } = require('xmlhttprequest')
defineKnorryOptions({
    XHRClass: XMLHttpRequest
})
```
This method is not recommended because it doesn't supports all features and you aren't in need of a lightweight client in nodejs. Use a more robust client like [axios](https://npmjs.com/package/axios) instead