import path from 'path'
import express from 'express'
import esMain from 'es-main'
import fs from 'fs'
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

    app.put('/true', (req, res) => {
        res.json(true)
    })
    app.delete('/true', (req, res) => {
        res.json(true)
    })
    app.options('/true', (req, res) => {
        res.json(true)
    })
    app.patch('/true', (req, res) => {
        res.json(true)
    })
    app.head('/true', (req, res) => res.end())

    // Plain text endpoint
    app.get('/textresp', (req, res) => {
        res.send('!!TEST_TEXT!!')
        fn()
    })

    app.post('/echo-json-data', (req, res) => {
        const { worked } = req.body
        res.json(worked)
    })

    app.post('/echo-formdata', (req, res) => {
        const data = {}

        req.busboy.on('field', function (key, value) {
            data[key] = value
        })

        req.busboy.on('file', (fieldname, file, filename) => {
            return
        })

        req.busboy.on('finish', () => {
            res.json(data)
        })

        req.pipe(req.busboy)
    })

    app.post('/upload-file', (req, res) => {
        req.busboy.on('field', function (key, value) {

        })

        req.busboy.on('file', (fieldname, file, filename) => {
                const fstream = fs.createWriteStream(path.join(__dirname, 'file.txt'))

                file.pipe(fstream)

                fstream.on('close', () => {
                    console.log('Uploaded file')
                    const fcontent = fs.readFileSync(path.join(__dirname, 'file.txt'), {
                        encoding: 'utf8'
                    })
                    fs.rmSync(path.join(__dirname, 'file.txt'))
                    res.json(fcontent.includes('TRUE'))
                })
        })

        req.busboy.on('finish', () => {
            
        })

        req.pipe(req.busboy)
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
    app.get('/main.js.map', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'main.js.map'))
    })
    app.listen(4560, () => {
        console.log('Server is listening!')
    })
}