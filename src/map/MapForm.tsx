import { useContext, useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { ShipContext } from "../ships/ShipProvider";
import { MapContext } from "./MapProvider";
import { useAppBarHeight } from "../app/app-bar-height.hook";

const StyledContainer = styled(Container)(({ theme }) => {
  const height = useAppBarHeight(theme);
  return { marginTop: height };
});

export const MapForm = () => {
  const { size, createMap } = useContext(MapContext);
  const { ships, deleteShip } = useContext(ShipContext);
  const widthInput = useRef<HTMLInputElement>(null);
  const createMapClicked = () => {
    ships.forEach((s) => deleteShip(s.name));
    createMap(widthInput.current?.value);
  };

  return (
    <StyledContainer>
      <Stack component="form" noValidate autoComplete="off" spacing={2}>
        <TextField label="Ancho inicial del mapa" type="number" inputRef={widthInput} defaultValue={size.x} />
        <Button variant="contained" onClick={createMapClicked}>
          Crear
        </Button>
      </Stack>
    </StyledContainer>
  );
};
