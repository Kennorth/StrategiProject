import React from "react";
import { Button, TitleButton } from "./styles";

interface IButtonTeamsProps {
  onClick?: () => void;
}
export default function TeamButton({onClick}:IButtonTeamsProps){
  return (
    <Button onClick={onClick}>
      <TitleButton>Monte Sua Equipe</TitleButton>
    </Button>
  );
}