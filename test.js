import test from 'ava'
import dpm from './'

test('in this repo', async t => {
  const pm = await dpm()
  t.is(pm, 'yarn')
})

test('in fixture which is using package-lock.json', async t => {
  const pm = await dpm({ cwd: 'fixtures/package-lock' })
  t.is(pm, 'npm')
})

test('in fixture which is empty', async t => {
  const pm = await dpm({ cwd: 'fixtures/empty' })
  t.is(pm, 'yarn')
})
