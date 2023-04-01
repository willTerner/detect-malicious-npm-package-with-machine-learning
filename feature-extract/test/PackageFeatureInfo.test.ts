
import { extractJSFilePath } from '../src/feature-extract/PackageJSONInfo'

test('test extract js file', async () => {
  expect(extractJSFilePath('start /B node preinstall.js & node preinstall.js')).toBe('preinstall.js')
})

test('test package feature', async () => {
})
