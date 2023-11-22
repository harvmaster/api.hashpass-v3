module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // globalSetup: './tests/integration/ServerSetup.ts',
  // globalTeardown: './tests/integration/ServerTeardown.ts',
};