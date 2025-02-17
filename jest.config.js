module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/?(*.)test.{js,jsx}'], // looks for your test
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/', '/dist/', '/mock/'],
  transformIgnorePatterns: ['/node_modules/', '/public/', '/dist/', '/mock/'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // sets ut test files
  globals: {
    __UMI_HTML_SUFFIX: false,
  },
}
