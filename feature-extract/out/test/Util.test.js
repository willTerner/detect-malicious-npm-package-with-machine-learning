test('test featureinfo judge function', () => {
  const result = '\\x90'.match(/\".*(\\x[0-9a-f]{2})+.*\"/i)
  console.log(result[1])
})
export {}
// # sourceMappingURL=Util.test.js.map
