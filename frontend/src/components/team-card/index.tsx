import axios from "axios";
import React, { useEffect, useState } from "react";
import TeamHero from "../team-hero";
import { AvaliablesWrapper, SelectedWrapper, TeamName, TeamWrapper, Title, Wrapper } from "./styles";

interface ITeamProps {
  team: {id: number, nome: string, herois:apiService.Character[]};
}
export default function TeamCard({team}:ITeamProps){
  const [teamHeroes, setTeamHeroes] = useState([] as apiService.Character[]);
  const [avaliablesHeros, setAvaliablesHeroes] = useState([] as apiService.Character[]);
  useEffect(() =>{
    loadAvailable();
  }, [])

const loadAvailable= () =>{
    axios.get("https://heitorppaiva.pythonanywhere.com/disponivel")
    .then(function(response){
      console.log(response.data)
      setAvaliablesHeroes(response.data);
      loadTeamHeroes();
    })
    .catch(function(err){
      console.log(err);
    });
}


  const addTeamHeroes = (heroi:apiService.Character) => {
    axios.post("https://heitorppaiva.pythonanywhere.com/add", {"equipe": `${team.id}`, "heroi": `${heroi.nome}`})
    .then(function(response){
      loadTeamHeroes();
      loadAvailable();
      console.log("teste")
    })
    .catch(function(err){
      console.log(err);
    });
  }
  const loadTeamHeroes = () => {
    axios.get("https://heitorppaiva.pythonanywhere.com/team", {headers:{'Content-Type': 'application/json'}, params:{"equipe":`${team.nome}`}})
    .then(function(response){
      setTeamHeroes(response.data.herois);
    })
    .catch(function(err){
      console.log(err);
    });
  }
  const deleteHero = (heroi:apiService.Character) => {
    const equipe = 0 
    axios.post("https://heitorppaiva.pythonanywhere.com/add", {"equipe":`${equipe}`, "heroi": `${heroi.nome}`})
    .then(function(response){
      loadTeamHeroes();
      console.log("tentando")
    })
    .catch(function(err){
      console.log(err);
    });
  }
  console.log(team.nome);
  return (
    <Wrapper>
      <TeamName>{team.nome}</TeamName>
      <TeamWrapper>
        <Title>Disponiveis</Title>
        <AvaliablesWrapper>
          {avaliablesHeros.map((item, i) => <TeamHero key={`no-time-hero-${i}`} hero={item} onClick={() => addTeamHeroes(item)} />)}
        </AvaliablesWrapper>
      </TeamWrapper>
      <TeamWrapper>
        <Title>Selecionados</Title>
        <SelectedWrapper>
        {teamHeroes.map((item, i ) => <TeamHero key={`time-hero-${i}`} hero={item} />)}
        </SelectedWrapper>
      </TeamWrapper>
    </Wrapper>
  );
}