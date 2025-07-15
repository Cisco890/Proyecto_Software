import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders the input and filter button", () => {
    const { getByPlaceholderText, getByRole } = render(
      <SearchBar
        searchText=""
        setSearchText={() => {}}
        onOpenFilters={() => {}}
      />
    );

    expect(getByPlaceholderText("Busca un tutor o materia")).toBeTruthy();
    expect(getByRole("button")).toBeTruthy();
  });

  it("calls setSearchText when text changes", () => {
    const setSearchTextMock = jest.fn();

    const { getByPlaceholderText } = render(
      <SearchBar
        searchText=""
        setSearchText={setSearchTextMock}
        onOpenFilters={() => {}}
      />
    );

    const input = getByPlaceholderText("Busca un tutor o materia");
    fireEvent.changeText(input, "matemáticas");

    expect(setSearchTextMock).toHaveBeenCalledWith("matemáticas");
  });

  it("calls onOpenFilters when filter button is pressed", () => {
    const onOpenFiltersMock = jest.fn();

    const { getByRole } = render(
      <SearchBar
        searchText=""
        setSearchText={() => {}}
        onOpenFilters={onOpenFiltersMock}
      />
    );

    const button = getByRole("button");
    fireEvent.press(button);

    expect(onOpenFiltersMock).toHaveBeenCalled();
  });
});
