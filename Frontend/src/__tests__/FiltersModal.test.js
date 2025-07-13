import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FiltersModal from "../components/FiltersModal";

describe("FiltersModal", () => {
  const onCloseMock = jest.fn();
  const onApplyMock = jest.fn();

  it("renders modal when visible is true", () => {
    const { getByText } = render(
      <FiltersModal
        visible={true}
        onClose={onCloseMock}
        onApply={onApplyMock}
      />
    );

    expect(getByText("Filtros")).toBeTruthy();
    expect(getByText("Materias")).toBeTruthy();
    expect(getByText("Modalidad")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByRole } = render(
      <FiltersModal
        visible={true}
        onClose={onCloseMock}
        onApply={onApplyMock}
      />
    );

    const closeButton = getByRole("button"); // Ionicons dentro de TouchableOpacity
    fireEvent.press(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("selects and applies filters correctly", () => {
    const { getByText } = render(
      <FiltersModal
        visible={true}
        onClose={onCloseMock}
        onApply={onApplyMock}
      />
    );

    const filterBtn = getByText("Matemáticas");
    fireEvent.press(filterBtn);

    const applyBtn = getByText("Aplicar filtros");
    fireEvent.press(applyBtn);

    expect(onApplyMock).toHaveBeenCalledWith(
      expect.arrayContaining(["Matemáticas"])
    );
    expect(onCloseMock).toHaveBeenCalled();
  });
});
