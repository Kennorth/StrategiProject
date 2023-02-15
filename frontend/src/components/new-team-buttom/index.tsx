import axios from "axios";
import React, { useState } from "react";
import { Button, ButtonSubmit, Input, TitleButton } from "./styles";

interface Iprops{
  NewTeam: () => void;
}
export default function NewTeamButton({NewTeam}:Iprops){
  const [inputVisible, setInputVisible] = useState(false);
  const [value, setValue] = useState('');
  
  const handleSubmit = (val: string) => {
    console.log(val);
    axios.post("https://heitorppaiva.pythonanywhere.com/equipe",{"nome": `TESTE2`}, 
    {headers:{'Content-Type': 'application/json'}})
    .then(function(response){
      NewTeam();
      setInputVisible(false);
      console.log(response)
    })
    .catch(function(err){
      console.log(err);
    });
  }
  return(
    <Button>
      {!inputVisible && <TitleButton onClick={() => setInputVisible(true)}>
        Criar Novo Time
      </TitleButton>}
      {inputVisible && <form onSubmit={() => handleSubmit(value)} style={{display: 'flex', 
      flexDirection: 'row', alignItems: 'center'}}>
          <Input type={'text'} value={value} onChange={(e) => setValue(e.target.value)}/>
          <ButtonSubmit type={'submit'} value={'criar'}/>
        </form>}
    </Button>
  );
}