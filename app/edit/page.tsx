'use client'

import { useState, useEffect } from 'react'
import { useSeminars } from '../hooks/useSeminars'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { SeminarType } from '../types/seminarType'

const SelectContainer = styled.div`
  max-width: 800px;
`

const Select = styled.select`
  max-width: 710px;
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  color: #333;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`

const Option = styled.option`
  padding: 8px;
`

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;

  font-size: 32px;
`

const Edit = () => {
  const router = useRouter()
  const { getSeminars } = useSeminars()
  const [seminars, setSeminars] = useState<SeminarType[]>([])

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const data = await getSeminars()
        setSeminars(data)
      } catch (error) {
        console.error('Error fetching seminars:', error)
      }
    }

    fetchSeminars()
  }, [])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    if (selectedId) {
      router.push(`/edit/${selectedId}`)
    }
  }

  return (
    <SelectContainer>
      <Title>Выберите семинар для редактирования</Title>
      <Select onChange={handleSelectChange} defaultValue="">
        <Option value="" disabled>Выберите семинар...</Option>
        {seminars.map((seminar) => (
          <Option key={seminar.id} value={seminar.id}>
            {seminar.id}. {seminar.title}
          </Option>
        ))}
      </Select>
    </SelectContainer>
  )
}

export default Edit
