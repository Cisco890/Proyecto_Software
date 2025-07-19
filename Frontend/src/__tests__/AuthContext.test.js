import React from "react";
import { render, act } from "@testing-library/react-native";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads user from AsyncStorage on mount", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({ id: 1, name: "Luis" })
    );
    let contextValue;

    const { findByText } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <></>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Espera a que se cargue el usuario
    await act(() => Promise.resolve());

    expect(contextValue.user).toEqual({ id: 1, name: "Luis" });
  });

  it("saves user on login", async () => {
    let contextValue;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <></>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login({ id: 2, name: "Ana" });
    });

    expect(contextValue.user).toEqual({ id: 2, name: "Ana" });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ id: 2, name: "Ana" })
    );
  });

  it("clears user on logout", async () => {
    let contextValue;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <></>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login({ id: 3, name: "Carlos" });
    });

    await act(async () => {
      await contextValue.logout();
    });

    expect(contextValue.user).toBe(null);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
