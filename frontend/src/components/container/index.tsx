import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../card-hero";
import { Title, UtilityButtonsWrapper, Wrapper } from "./styles";
import { Button, ButtonSubmit, Input, TitleButton } from "./styles";
import { Md5 } from "ts-md5";
import LoadHeroButton from "../load-heroes-button";
import TeamButton from "../teams-button";
import TeamCard from "../team-card";
import NewTeamButton from "../new-team-buttom";



export default function Container(props:React.PropsWithChildren){
  const [heroes, setHeroes] = useState([] as apiService.MarvelCharacter[]);
  const [call, setCall] = useState(0);
  const [steps, setSteps] = useState('selection');
  const [equipes, setEquipes] = useState([{id: 1, nome:'vingadores', herois:[] as apiService.Character[]}]);
  const [inputVisible, setInputVisible] = useState(false);
  const [value, setValue] = useState('');

  const publicKey = "dd42e0b583b5dd05c53a12954ba7ae1f";
  const privatKey = "988851186e1e988261280fa3836905ddf6d4b0b8";
  const time = Number(Date.now());
  const str = `${time}${privatKey}${publicKey}`;
  const hash = Md5.hashStr(str);
  const quantidade = 20;
  
  const loadHeroes = () =>{ 
    axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${time}&limit=${quantidade}&offset=${call}&apikey=${publicKey}&hash=${hash}`)
     .then((response) => {
       console.log(response.data.data.results);
      
       setHeroes(response.data.data.results)
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro : " + err);
  });}

  const loadEquipes = ()=>{
    axios.get("https://heitorppaiva.pythonanywhere.com/equipe")
    .then(function(response){
      setEquipes(response.data);
    })
    .catch(function(err){
      console.log(err);
    });
  }
  useEffect(() => {
    loadEquipes();
  }, []);

  useEffect(() => {
    loadHeroes();
  }, [call]);

  const handleSubmit = (val: string) => {
    console.log(val);
    axios.post("https://heitorppaiva.pythonanywhere.com/equipe",{"nome": `${val}`}, 
    {headers:{'Content-Type': 'application/json'}})
    .then(function(response){
      loadEquipes();
      setInputVisible(false);
      console.log(response)
    })
    .catch(function(err){
      console.log(err);
    });
  }

  const testando = ()=>{
    axios.get("https://heitorppaiva.pythonanywhere.com/disponivel")
    .then(function(response){
      console.log(response.data);
    })
    .catch(function(err){
      console.log(err);
    });
  }

testando()



  
  return (
    <Wrapper>
      {steps === 'selection' && 
      <>
        <Title>Selecione seus Heroes</Title>
        {heroes.map((item) => 
        <Card
          key={`hero-${item.id}`} 
          heroName={item.name} 
          heroDescription={item.description} 
          heroImg={`${item.thumbnail.path}.${item.thumbnail.extension}`}/>
        )}
        <UtilityButtonsWrapper>
          <LoadHeroButton onClick={() => setCall(call + 21)}/>
          <TeamButton  onClick={() => setSteps("equipes")}/>
        </UtilityButtonsWrapper>
      </>}
      {steps === 'equipes' && <>
      <Title>Monte suas Equipes</Title>
      {equipes.map((item, i) => <TeamCard key={`itemCardTeam-${i}`} team={item}/>)}
      


      <Input type={'text'} value={value} onChange={(e) => setValue(e.target.value)}/>
      <ButtonSubmit onClick={()=> handleSubmit(`${value}`)}><text>nova equipe</text></ButtonSubmit>
      


      </>}
    </Wrapper>
    );
}