# dotenv

<img src="https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.png" alt="dotenv" align="right" />

Dotenv-buffer is completely based upon [Scott Motte's dotenv](https://github.com/motdotla/dotenv).

The following is changed:
- only takes buffer as input
- no cli options
- changed test harnes to tape
- no dependencye on fs, i.e. can be used in React Native

## Install

```bash
# with npm
npm install dotenv-buffer

# or with Yarn
yarn add dotenv-buffer
```

## Usage

As early as possible in your application, require and configure dotenv and pass it a buffer containing a .env file.

```javascript
const dotenvBuffer = require('dotenv')
const buf = readBufferFromS3orOtherPlace()
dotenvBuffer.config(buf)
```

The buffer should contain a `.env` file which you store in a secure place, for example an encrypted S3 bucket. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.
For example:

```dosini
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

That's it.

`process.env` now has the keys and values you defined in your `.env` file.

```javascript
const db = require('db')
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
})
```


### Rules

The parsing engine currently supports the following rules:

- `BASIC=basic` becomes `{BASIC: 'basic'}`
- empty lines are skipped
- lines beginning with `#` are treated as comments
- empty values become empty strings (`EMPTY=` becomes `{EMPTY: ''}`)
- single and double quoted values are escaped (`SINGLE_QUOTE='quoted'` becomes `{SINGLE_QUOTE: "quoted"}`)
- new lines are expanded if in double quotes (`MULTILINE="new\nline"` becomes

```
{MULTILINE: 'new
line'}
```
- inner quotes are maintained (think JSON) (`JSON={"foo": "bar"}` becomes `{JSON:"{\"foo\": \"bar\"}"`)
- whitespace is removed from both ends of the value (see more on [`trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)) (`FOO="  some value  "` becomes `{FOO: 'some value'}`)

## FAQ

### What happens to environment variables that were already set?

We will never modify any environment variables that have already been set. In particular, if there is a variable in your `.env` file which collides with one that already exists in your environment, then that variable will be skipped. This behavior allows you to override all `.env` configurations with a machine-specific environment, although it is not recommended.

If you want to override `process.env` you can do something like this:

```javascript
const fs = require('fs')
const dotenv = require('dotenv')
const envConfig = dotenv.parse(fs.readFileSync('.env.override'))
for (var k in envConfig) {
  process.env[k] = envConfig[k]
}
```

## License

See [LICENSE](LICENSE)
