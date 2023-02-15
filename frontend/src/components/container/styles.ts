import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  min-height: 100%;
  background-color: #b80000;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 32px;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  font-family: system-ui;
  color: #DBBB4B;
  width: 100%;
`;

export const UtilityButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
`;

export const Button = styled.button`
  width: calc(50% - 10px);
  min-width: 250px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: #4caf50;
  border: none;
`;
export const TitleButton = styled.div`
  font-family: system-ui;
  font-size: 24px;
  font-weight: 400;
  color: #abb8c3;
  max-width: 60%;
`;
export const Input = styled.input`
  font-family: system-ui;
  font-size: 18px;
  color:  #4caf50;
  padding: 8px;
  height: 32px;
  border-radius: 12px;
  border: none;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;

`;
export const ButtonSubmit = styled.button`
  font-family: system-ui;
  font-size: 18px;
  color:  #4caf50;
  width: 80px;
  height: 48px;
  border-radius: 12px;
  border: none;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
`;
