import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

// ✅ Declarar el mock CON NOMBRE permitido por Jest
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// ✅ Interceptar el hook y devolver siempre el mock
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockNavigation,
}));

describe("Footer", () => {
  const renderWithContext = (user) =>
    render(
      <AuthContext.Provider value={{ user }}>
        <Footer />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls navigation.goBack when back button is pressed", () => {
    const { getAllByRole } = renderWithContext({ id_perfil: 1 });
    fireEvent.press(getAllByRole("button")[0]);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("navigates to Home when home button is pressed", () => {
    const { getAllByRole } = renderWithContext({ id_perfil: 1 });
    fireEvent.press(getAllByRole("button")[1]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("DrawerNavigator", {
      screen: "Home",
    });
  });

  it("shows enabled profile button for tutor (id_perfil = 2)", () => {
    const { getAllByRole } = renderWithContext({ id_perfil: 2 });
    fireEvent.press(getAllByRole("button")[2]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("Profile");
  });

  it("renders disabled profile button for students", () => {
    const { getAllByRole } = renderWithContext({ id_perfil: 1 });
    const buttons = getAllByRole("button");
    expect(buttons[2].props.accessibilityState?.disabled || false).toBe(true);
  });
});
