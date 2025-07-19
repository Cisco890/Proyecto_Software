import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FiltersModal from "../components/FiltersModal";

describe("FiltersModal", () => {
  const onCloseMock = jest.fn();
  const onApplyMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  });

  it("calls onClose when close button is pressed", () => {
    const { getByLabelText } = render(
      <FiltersModal
        visible={true}
        onClose={onCloseMock}
        onApply={onApplyMock}
      />
    );

    const closeButton = getByLabelText("Cerrar modal");
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

    const matematicaBtn = getByText("Matemáticas");
    fireEvent.press(matematicaBtn);

    const applyBtn = getByText("Aplicar filtros");
    fireEvent.press(applyBtn);

    expect(onApplyMock).toHaveBeenCalledWith(
      expect.arrayContaining(["Matemáticas"])
    );
    expect(onCloseMock).toHaveBeenCalled();
  });
});
