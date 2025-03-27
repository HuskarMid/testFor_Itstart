'use client'

import styled from "styled-components";

const HomeUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  width: 50%;

  background-color: var(--secondary-color);
  padding: 20px;
  border-radius: 25px;
`;

const HomeLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 5px;
  color: #000000;
  
  &::before {
    content: '✓';
    margin-right: 10px;
    color: #000000;
  }
  
  & p {
    font-size: 19px;
  }
`;

export default function Home() {
  return (
    <>
      <h1 style={{marginTop: '12px'}}>Тестовое для ITstart</h1>
      <HomeUl>
        <HomeLi><p>Json server, список семинаров, типизация</p></HomeLi>
        <HomeLi><p>Кастомный хук useSeminars для работы с json server</p></HomeLi>
        <HomeLi><p>Удаление, редактирование, поиск, пагинация </p></HomeLi>
      </HomeUl>
    </>
  );
}