import path from 'path'
import fs from 'fs'
import express from 'express'
import chalk from 'chalk'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
import applyRoutes from './endpoints.js'

// Count tests
const htmlfile = fs.readFileSync(path.join(__dirname, 'test.html')).toString('utf8')
const testnames = []
htmlfile.replace(/\.as\(["'`](.*)["'`]\)/g, (_, testname) => {
    testnames.push(testname.trim())
    return ''
})
global.runTests = []
const testCount = testnames.length

let count = 0

// Timeout
const seconds = 60 * 2
const milis = seconds * 1000
const minutes = seconds / 60
setTimeout(async () => {
    console.log(chalk.red(`⏱️ Timeout during tests!`))
    await global.printFullLogs()
    global.printConsoleBuffer()
    process.exit(1)
}, milis)

console.log(chalk.gray(`[INFO] Timeout was set to ${minutes} minutes`))

// Express app
const app = express()

// Test page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'))
})
app.get('/test-engine.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-engine.js'))
})
app.get('/knorry.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'main.js'))
})
app.get('favicon.ico', (req, res) => {
    res.send('')
})

applyRoutes(app, () => {
    count += 1
})

// Listen
app.listen(4560, async () => {
    console.log(chalk.gray('[INFO] Server is listening'))
    console.log(chalk.cyan(`Waiting for all ${testCount} tests to complete...`))

    // Run tests
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: [
            '--no-sandbox'
        ]
    })
    const page = await browser.newPage()
    await page.goto(`http://localhost:4560`)
    const fileInput = await page.$('input[type="file"]')
    await fileInput.uploadFile(path.join(__dirname, '..', 'testf.txt'))

    global.printFullLogs = async () => {
        console.log(chalk.cyan('Full log:'))
        const pre = await page.$('#tests')
        const prep = await pre.getProperty('innerText')
        const fulllog = await prep.jsonValue()

        console.log(fulllog)
    }

    let consolebuffer = []
    let consolebufferf = []

    global.printConsoleBuffer = () => {
        for (const c of [...consolebuffer, ...consolebufferf]) {
            console.log(...c)
        }
    }

    page.on('requestfailed', request => {
        consolebufferf.push([chalk.red(`[FAILED REQUEST] url: ${request.url()}, errText: ${request.failure().errorText}, method: ${request.method()}`)])
    })

    page.on('console', async message => {
        const args = await Promise.all(message.args().map(arg => {
            return arg.jsonValue().catch(() => {
                return arg.toString()
            })
        }))
        if (args.join(' ').trim() !== '') consolebuffer.push(['[CONSOLE]', ...args])
    })

    await sleep(500)

    let done = false
    try {
        process.stdout.cursorTo(0)
        process.stdout.write('Test Status: ')
    } catch {}
    
    while (!done) {
        const h2 = await page.$('#teststat')
        const h2p = await h2.getProperty('innerText')
        const teststat = await h2p.jsonValue()

        const pre = await page.$('#tests')
        const prep = await pre.getProperty('innerText')
        const fulllog = await prep.jsonValue()
        for (const f of fulllog.split('\n')) {
            for (const n of testnames) {
                if (f.includes(n)) {
                    global.runTests.push(n)
                    global.runTests = [...new Set(global.runTests)]
                }
            }
        }

        try {
            process.stdout.cursorTo(14)
            process.stdout.clearLine(1)
            process.stdout.write(teststat)
        } catch {
            console.log(teststat)
        }

        if (teststat.startsWith('❌')) {
            // At least one test failed!
            // Stop it and log the full protocol
            console.log()
            console.log(chalk.red('❌ At least one test failed, closing!'))
            
            console.log(chalk.cyan('Full log:'))
            const pre = await page.$('#tests')
            const prep = await pre.getProperty('innerText')
            const fulllog = await prep.jsonValue()

            console.log(fulllog)

            for (const c of [...consolebuffer, ...consolebufferf]) {
                console.log(...c)
            }
            
            process.exit(1) 
        } else {
            const [completed, total] = teststat.split('/').map(v => v.replace(/✅/g, '').trim()).map(v => parseInt(v))
            if (total >= testCount) {

                    if (completed >= total) {
                        console.log()
                        console.log(chalk.green('✅ All tests were successful'))
                        console.log(chalk.cyan('Full log:'))
                        const pre = await page.$('#tests')
                        const prep = await pre.getProperty('innerText')
                        const fulllog = await prep.jsonValue()

                        console.log(fulllog)

                        for (const c of consolebuffer) {
                            console.log(...c)
                        }

                        process.exit(0)
                    }
                    
            }
        }

        await sleep(333.333_333)
    }
})
