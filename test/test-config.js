const test = require('tape');
const dotenv = require('../lib/main');

const envBuf = Buffer.from(`
  DB_NAME=test
  test=foo
`);

const mockParseResponse = {
  DB_NAME: 'test',
  test: 'foo',
};

test('reads env-buffer, parsing output to process.env', (ct) => {
  const res = dotenv.config(envBuf);
  ct.same(res.parsed, mockParseResponse);
  ct.end();
});

test('does not write over keys already in process.env', (ct) => {
  const existing = 'bar';
  process.env.test = existing;
  // 'foo' returned as value in `beforeEach`. should keep this 'bar'
  const env = dotenv.config(envBuf);

  ct.equal(env.parsed.test, mockParseResponse.test);
  ct.equal(process.env.test, existing);
  ct.end();
});

test('does not write over keys already in process.env if the key has a falsy value', (ct) => {
  const existing = '';
  process.env.test = existing;
  // 'foo' returned as value in `beforeEach`. should keep this ''
  const env = dotenv.config(envBuf);

  ct.equal(env.parsed.test, mockParseResponse.test);
  // NB: process.env.test becomes undefined on Windows
  ct.notOk(process.env.test);
  ct.end();
});

test('returns parsed object', (ct) => {
  const env = dotenv.config(envBuf);
  ct.notOk(env.error);
  ct.deepEqual(env.parsed, mockParseResponse);
  ct.end();
});
