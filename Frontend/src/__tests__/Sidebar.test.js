import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

describe("Sidebar", () => {
  const navigationMock = {
    navigate: jest.fn(),
  };

  const logoutMock = jest.fn();

  const renderSidebar = (user) =>
    render(
      <AuthContext.Provider value={{ user, logout: logoutMock }}>
        <Sidebar navigation={navigationMock} />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user name and student message for profile 1", () => {
    const { getByText } = renderSidebar({ nombre: "Ana", id_perfil: 1 });

    expect(getByText("Ana")).toBeTruthy();
    expect(getByText("Bienvenido estudiante")).toBeTruthy();
  });

  it("renders tutor options for profile 2", () => {
    const { getByText } = renderSidebar({ nombre: "Carlos", id_perfil: 2 });

    expect(getByText("Perfil de Tutor")).toBeTruthy();
    expect(getByText("Sesiones")).toBeTruthy();
    expect(getByText("Reseñas")).toBeTruthy();
  });

  it('navigates to Home when "Inicio" is pressed', () => {
    const { getByText } = renderSidebar({ nombre: "Ana", id_perfil: 1 });

    fireEvent.press(getByText("Inicio"));

    expect(navigationMock.navigate).toHaveBeenCalledWith("Home");
  });

  it('calls logout when "Cerrar sesión" is pressed', () => {
    const { getByText } = renderSidebar({ nombre: "Carlos", id_perfil: 2 });

    fireEvent.press(getByText("Cerrar sesión"));

    expect(logoutMock).toHaveBeenCalled();
  });
});
