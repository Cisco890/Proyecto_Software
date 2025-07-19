import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/api";

// Mocks
jest.mock("../api/api", () => ({
  login: jest.fn(),
}));

describe("LoginScreen", () => {
  const loginMock = jest.fn();
  const navigationMock = {
    navigate: jest.fn(),
  };

  const renderScreen = () =>
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <LoginScreen navigation={navigationMock} />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input fields and buttons", () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    expect(getByPlaceholderText("Ingresa tu correo")).toBeTruthy();
    expect(getByPlaceholderText("Ingresa tu contraseña")).toBeTruthy();
    expect(getByText("Iniciar sesión")).toBeTruthy();
    expect(getByText(/Regístrate/)).toBeTruthy();
  });

  it("updates inputs when typing", () => {
    const { getByPlaceholderText } = renderScreen();

    const emailInput = getByPlaceholderText("Ingresa tu correo");
    const passInput = getByPlaceholderText("Ingresa tu contraseña");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passInput, "123456");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passInput.props.value).toBe("123456");
  });

  it("calls login and shows modal on successful login", async () => {
    api.login.mockResolvedValueOnce({
      data: { user: { nombre: "Test", id: 1 } },
    });

    const { getByPlaceholderText, getByText, findByText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText("Ingresa tu correo"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Ingresa tu contraseña"),
      "123456"
    );
    fireEvent.press(getByText("Iniciar sesión"));

    expect(api.login).toHaveBeenCalledWith("test@example.com", "123456");
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ nombre: "Test", id: 1 });
      expect(findByText("Inicio de sesión exitoso")).toBeTruthy();
    });
  });

  it("navigates to Register screen when link is pressed", () => {
    const { getByText } = renderScreen();

    fireEvent.press(getByText(/Regístrate/));

    expect(navigationMock.navigate).toHaveBeenCalledWith("Register");
  });
});
