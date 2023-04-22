import path from 'path'
import express from 'express'
import esMain from 'es-main'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import basicAuth from 'basic-auth'
import busboy from 'connect-busboy'
import bodyParser from 'body-parser'

const USERNAME = 'gunnar'
const PASSWORD = 'gneg'

const auth = (req, res, next) => {
    const user = basicAuth(req)

    // Check if the user is authenticated
    if (!user || user.name.toString('utf8').trim() !== USERNAME || user.pass.toString('utf8').trim() !== PASSWORD) {
        // Send a 401 Unauthorized response
        console.log(req.headers.Authorization)
        res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
        res.status(401);
        res.send(false)
        return;
    }

    // User is authenticated
    next();
}

export default function applyRoutes(app, fn = () => {}) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.text())
    app.use(busboy({ highWaterMark: 2 * 1024 * 1024 }))

    // Test json endpoint
    app.get('/jsonresp', (req, res) => {
        res.send({
            worked: true
        })
        fn()
    })

    app.get('/auth', auth, (req, res) => {
        // Send a true response indicating successful authentication
        res.send(true)
    })

    app.post('/json', (req, res) => {
        res.send({
            value: true
        })
    })

    app.get('/bool', (req, res) => {
        res.send(true)
    })

    app.get('/echoheaders', (req, res) => {
        res.send(req.headers)
        fn()
    })

    app.get('/timeout-test', () => {
        fn()
    })

    app.get('/jsonarrayresp', (req, res) => {
        res.send([true])
        fn()
    })

    // Plain text endpoint
    app.get('/textresp', (req, res) => {
        res.send('!!TEST_TEXT!!')
        fn()
    })

    app.post('/echo-json-data', (req, res) => {
        const { worked } = req.body
        res.json(worked)
    })

    app.post('/plain-post', (req, res) => {
        res.json(req.body === 'TEST')
    })
}

if (esMain(import.meta)) {
    const app = express()
    app.use(express.static(__dirname))
    applyRoutes(app)
    app.get('favicon.ico', (req, res) => {
        res.send('')
    })
    app.get('/knorry.js', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'main.js'))
    })
    app.listen(4560, () => {
        console.log('Server is listening!')
    })
}