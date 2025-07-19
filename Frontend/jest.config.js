module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?|react-clone-referenced-element|react-native-svg)",
  ],
  moduleNameMapper: {
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/@react-native-async-storage/async-storage.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/@expo/vector-icons.js",
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
