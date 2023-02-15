import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "./styles";

type HeroTYpe = {
  nome: string;
  descricao: string;
  imagem: string;
}
interface IButtonProps{
  hero: HeroTYpe;
}
export default function CardButton({hero, ...props}:IButtonProps){
  const [selected, setSelected] = useState(false);
  const [heroId, setHeroId] = useState(0);
  
  useEffect(()=>{
    axios.get("https://heitorppaiva.pythonanywhere.com/search", {headers:{'Content-Type': 'application/json'}, params: {"nome":`${hero.nome}`}})
    .then(function(response){
      setSelected(response.data !== false?true:false);
    })
    .catch(function(err){
      console.log(err);
    });
  }, []);

  const insertHero = (hero: HeroTYpe) => {
    axios.post("https://heitorppaiva.pythonanywhere.com/heroi", {"nome": `${hero.nome}`, "descricao": `${hero.descricao}`, "imagem": `${hero.imagem}`}, {headers:{'Content-Type': 'application/json'}})
    .then(function(response){
      setSelected(!selected);
    })
    .catch(function(err){
      console.log(err);
    });
  }

  const deleteHero = (heroName: string) => {
    axios.delete("https://heitorppaiva.pythonanywhere.com/heroi", {data: {"nome": `${heroName}`}})
    .then(function(response){
      setSelected(!selected);
    })
    .catch(function(err){
      console.log(err);
    });
  }

  const handleClick = () => {
    !selected ? insertHero(hero): deleteHero(hero.nome);
  }
  return(
      <Button onClick={() => handleClick()} style={{backgroundColor: selected ? '#4caf50' : '#abb8c3'}}>{selected? 'Heroe Selecionado!' : 'Selecione o Heroe'}</Button>
  );
}