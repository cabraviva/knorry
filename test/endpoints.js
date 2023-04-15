import path from 'path'
import express from 'express'
import esMain from 'es-main'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function applyRoutes(app) {
    // Test json endpoint
    app.get('/jsonresp', (req, res) => {
        res.send({
            worked: true
        })
    })

    app.get('/jsonarrayresp', (req, res) => {
        res.send([true])
    })

    // Plain text endpoint
    app.get('/textresp', (req, res) => {
        res.send('!!TEST_TEXT!!')
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