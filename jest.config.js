module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testPathIgnorePatterns: ['dist/'],
  coveragePathIgnorePatterns: ['dist/'],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
  ],
};
