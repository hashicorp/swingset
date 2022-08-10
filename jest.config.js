module.exports = {
  testPathIgnorePatterns: ['<rootDir>/examples'],
  moduleNameMapper: {
    '\\.module.css$': 'identity-obj-proxy',
  },
  transform: {
    '\\.[jt]sx?$': [
      '@swc-node/jest',
      {
        jsx: true,
        react: { runtime: 'automatic' },
        minify: false,
      },
    ],
  },
  testEnvironment: 'jsdom',
}
