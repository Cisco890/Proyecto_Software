import React from "react";
import { render, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, AuthContext } from "../context/AuthContext";

// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("AuthContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loads user from AsyncStorage on mount", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({ nombre: "Ana" })
    );

    let contextValue;

    await act(async () => {
      render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              contextValue = value;
              return null;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    expect(contextValue.user).toEqual({ nombre: "Ana" });
    expect(contextValue.loading).toBe(false);
  });

  it("saves user on login", async () => {
    const user = { nombre: "Carlos", id: 1 };
    let contextValue;

    await act(async () => {
      render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              contextValue = value;
              return null;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    await act(async () => {
      await contextValue.login(user);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(user)
    );
    expect(contextValue.user).toEqual(user);
  });

  it("clears user on logout", async () => {
    const user = { nombre: "Carlos", id: 1 };
    let contextValue;

    await act(async () => {
      render(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              contextValue = value;
              return null;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    await act(async () => {
      await contextValue.login(user);
    });

    await act(async () => {
      await contextValue.logout();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
    expect(contextValue.user).toBe(null);
  });
});
