"use client";

import { useEffect, useState } from "react";
import { useSeminars } from "../hooks/useSeminars";
import styled from "styled-components";
import { SeminarType } from "../types/seminarType";
import { useRouter } from "next/navigation";

const SeminarList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`;

const SeminarItem = styled.li`
  position: relative;
  height: 250px;
  width: 49%;
  gap: 10px;
  background-color: var(--secondary-color);
  padding: 10px;
  border-radius: 10px;
  list-style: none;

  transition: 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const SeminarItemPhoto = styled.img`
  width: 180px;
  height: 230px;
  object-fit: cover;
  position: absolute;
  right: 0;
  top: 0;
  margin: 10px 10px 0 0;
  border-radius: 10px;
`;

const SeminarItemTitle = styled.div`
  width: 48%;
  height: 190px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;

  h2 {
    color: black;
    font-size: 1.35rem;
  }

  p {
    color: #2a2a2a
  }
`;

const SeminarItemUtils = styled.div`
  padding-top: 10px;
  width: 48%;
  display: flex;
  justify-content: end;
  align-items: end;
`;

const SeminarItemTime = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 74px;
  margin-right: auto;
  font-size: 12px;
  color: #2a2a2a;
`;

const SeminarItemTrash = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 2px;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const SeminarItemEdit = styled.img`
  width: 25px;
  height: 25px; 
  margin-bottom: 1px;
  cursor: pointer;

  transition: 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const Pagination = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  position: absolute;
  left: calc(50% - 100px);
  bottom: 30px;

  p {
    position: absolute;
    bottom: -25px;
    padding-left: 1px;
  }
`;

const PaginationButton = styled.button`
  padding: 5px 15px;
  border: none;
  background-color: var(--secondary-color);
  color: #000000;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background-color: #f0db86;
  }
`;

const InputSearch = styled.input`
  padding: 5px 15px;
  max-width: 190px;
  border: none;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  position: absolute;
  right: 41px;
  top: 40px;
  border-radius: 5px;
`;

const Seminars = () => {
  const { getSeminars, deleteSeminar } = useSeminars();
  const [seminars, setSeminars] = useState<SeminarType[]>([]);
  const [filteredSeminars, setFilteredSeminars] = useState<SeminarType[]>([])
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)

  const router = useRouter()

  // Подгрузка при старте страницы
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSeminars();
        setSeminars(data);
      } catch (error) {
        console.error('Error fetching seminars:', error);
      }
    };

    fetchData();
  }, []);

  // Пагинация и поиск
  useEffect(() => {
    let filtered = seminars
    if (searchText !== '') {
      filtered = seminars.filter((seminar) => seminar.title.toLowerCase().includes(searchText.toLowerCase()))
    }

    if (page < 1) {
      setPage(1)
    }
    if (seminars.length !== 0) {
      setFilteredSeminars(filtered.slice((page-1) * 8, page * 8))
    }
  }, [page, seminars, searchText]);

  // После удаления получаем seminars снова, обновляя state
  const handleDelete = async (id: number) => {
    try {
      console.log('Attempting to delete seminar:', id);
      await deleteSeminar(id);
      const updatedData = await getSeminars();
      setSeminars(updatedData);
    } catch (error) {
      console.error('Error deleting seminar:', error);
      alert('Ошибка при удалении семинара.');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`)
  }

  return (
    <div>
      <h1 style={{marginBottom: '20px'}}>Seminars</h1>
      <InputSearch type="text" placeholder="Search" onChange={(e) => setSearchText(e.target.value)} />
      <SeminarList>
        {filteredSeminars.map((seminar: SeminarType) => (
          <SeminarItem key={seminar.id}>
            <SeminarItemTitle>
              <h2>{seminar.title}</h2>
              <p>{seminar.description}</p>
            </SeminarItemTitle>
            <SeminarItemUtils>
              <SeminarItemTime>
                <p>{seminar.date}</p>
                <p>{seminar.time}</p>
              </SeminarItemTime>
              <SeminarItemTrash src="trash.svg" onClick={() => handleDelete(Number(seminar.id))}></SeminarItemTrash>
              <SeminarItemEdit src="edit.svg" onClick={() => handleEdit(Number(seminar.id))}></SeminarItemEdit>
            </SeminarItemUtils>
            <SeminarItemPhoto src={seminar.photo} alt={seminar.title} />
          </SeminarItem>
        ))}
      </SeminarList>
      <Pagination>
        <PaginationButton onClick={() => setPage(page - 1)}>←</PaginationButton>
        <PaginationButton onClick={() => setPage(page + 1)}>→</PaginationButton>
        <p>{page}</p>
      </Pagination>
    </div>
  );
};

export default Seminars;

