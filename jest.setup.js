// jest.setup.js
import '@testing-library/jest-dom'

// Polyfill for fetch in Node environment
global.fetch = jest.fn()

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})