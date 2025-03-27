import { SeminarType } from "../types/seminarType";

export const useSeminars = () => {
  return {
    getSeminars: () => fetchSeminars(),
    deleteSeminar: (id: number) => deleteSeminar(id),
    updateSeminar: (id: number, data: SeminarType) => updateSeminar(id, data),
  }
};

async function fetchSeminars() {
    const res = await fetch('http://localhost:4000/seminars');
    if (!res.ok) {
      throw new Error('Failed to fetch seminars');
    }
    return res.json();
}

async function deleteSeminar(id: string | number) {
  console.log(typeof id, ': ', id)
  const res = await fetch(`http://localhost:4000/seminars/` + id, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete seminar');
  }
  return res.json();
}

async function updateSeminar(id: string | number, data: SeminarType) {
  const res = await fetch(`http://localhost:4000/seminars/` + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update seminar');
  }
}

