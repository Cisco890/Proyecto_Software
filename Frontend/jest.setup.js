jest.mock("expo", () => ({
  ...jest.requireActual("expo"),
  Constants: { platform: { ios: {}, android: {} } },
}));
