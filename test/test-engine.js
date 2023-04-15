let testCount = 0
let failed = 0
let passed = 0

document.querySelector('#teststat').innerText = `${failed ? '❌' : '✅'} ${passed}/${testCount} tests passed (${failed} failed)`

function writeTestResult (emoji, tName, s = true) {
    document.querySelector('#tests').innerText += `\n[${emoji}] ${emoji === '⏱️' ? 'TIMEOUT: ' : ''}${tName}`
    if (s) {
        passed += 1
    } else {
        failed += 1
    }
    testCount += 1
    document.querySelector('#teststat').innerText = `${failed ? '❌' : '✅'} ${passed}/${testCount} tests passed (${failed} failed)`
}

function timeout (testName) {
    const t = setTimeout(() => {
        writeTestResult('⏱️', testName, false)
    }, 20_000)
    return () => {
        clearTimeout(t)
    }
}

function expression (v) {
    return {
        as: (testName) => {
            const s = v
            writeTestResult(s ? '✅' : '❌', testName, s)
        }
    }
}

function expect (func) {
    return {
        as: async (testName) => {
            const clearTout = timeout(testName)
            try {
                const s = (await func()) === true
                writeTestResult(s ? '✅' : '❌', testName, s)
                clearTout()
            } catch (err) {
                console.error(err)
                writeTestResult('🐞', 'ERROR: ' + testName, false)
                document.querySelector('#tests').innerText += `\n${err}`
                
                clearTout()
            }
        }
    }
}

function expectError(func) {
    return {
        as: async (testName) => {
            const clearTout = timeout(testName)
            try {
                await func()
                writeTestResult('❌', testName, false)
                clearTout()
            } catch (err) {
                writeTestResult('✅', testName, true)
                clearTout()
            }
        }
    }
}

function expectNoError(func) {
    return {
        as: async (testName) => {
            const clearTout = timeout(testName)
            try {
                await func()
                writeTestResult('✅', testName, true)
                clearTout()
            } catch (err) {
                writeTestResult('❌', testName, false)
                document.querySelector('#tests').innerText += `\nError: ${err}`
                clearTout()
            }
        }
    }
}