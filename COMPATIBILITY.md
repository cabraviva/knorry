# Compatibility

## This is based on caniuse tables and may not always be accurate

**Last updated: 2023-04-15**


| Browser                | Supported versions | Usage of supported versions | Usage of unsupported versions | Necessary Polyfills (for supported versions) |
| ------------------------ | -------------------- | ----------------------------- | ------------------------------- | ---------------------------------------------- |
| Chrome                 | >33                | ~25%                        | 0.14%                         | URLSearchParams[^2]                          |
| Edge                   | >12                | ~2.6%                       | 0%                            | URLSearchParams[^2]                          |
| Safari (Desktop)       | >7                 | ~4.4%                       | 0.04%                         | URLSearchParams[^2]                          |
| Firefox                | >29                | ~3%                         | 0.18%                         | None                                         |
| IE                     | 10, 11             | 0.42%                       | 0.13%                         | Promise, URLSearchParams                     |
| Chrome for Android     | >111[^1]           | ~41%                        | Unknown                       | None                                         |
| Safari (Mobile)        | >12.1              | ~1%                         | 0.01%                         | None                                         |
| Samsung Internet       | >4                 | ~2.7%                       | 0%                            | None                                         |
| Opera Mini             | None               | Unknown                     | ~1%                           | None                                         |
| Opera Mobile           | 73[^1]             | 0.01%                       | 0%                            | None                                         |
| UC Browser for Android | >13.4              | 0.91%                       | 0%                            | None                                         |
| Firefox for Android    | >110[^1]           | 0.3%                        | 0%                            | None                                         |
| Android Browser        | >4.4.4             | 0.25%                       | 0.18%                         | URLSearchParams[^2]                          |
| **Total**              | Unknown            | 98.4%                       | 1.6%                          | Promise on IE, URLSearchParams[^2]           |

## Sources

**If you want to check something yourself or want newer info, take a look at this:**

*Only relevant sources will be included here*

[XHR2](https://caniuse.com/xhr2)
[Promise](https://caniuse.com/promises)
[URLSearchParams](https://caniuse.com/urlsearchparams)

[^1]: Previous versions are probably supported too
    
[^2]: Only if you wish to support legacy browsers and only when using POST requests with data
