'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSeminars } from '@/app/hooks/useSeminars'
import { SeminarType } from '@/app/types/seminarType'
import { useParams, useRouter } from 'next/navigation'

const CreateProductContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`
const Form = styled.form<{ $chooseImgActive?: boolean; $errorScale: number }>`
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 10px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: ${props => 500 + 30 * props.$errorScale}px; // Если ошибки, то увеличиваем высоту формы
`
const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Label = styled.label`
    font-size: 16px;
    color: #333;
    font-weight: 500;
`

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    width: 77%;

    color: black;
    background-color: #ebebeb;
    
    &:focus {
        outline: none;
        border-color: var(--secondary-color);
    }
`

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    min-height: 125px;
    resize: vertical;

    color: black;

    background-color: #ebebeb;
    
    &:focus {
        outline: none;
        border-color: var(--secondary-color);
    }
`

const Button = styled.button`
    padding: 12px 20px;
    background-color: var(--main-color);
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #9a7de2;
    }
    
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

`

const ErrorMessage = styled.div`
    color: #ff4444;
    font-size: 14px;
    margin-top: 4px;
`

const BackButton = styled(Button)`
    background-color: #ffffff;
    margin-bottom: 20px;
    color: #000000;
    padding: 10px 20px;

    
    &:hover {
        background-color: #e1e1e1;
    }
`

const PageTitle = styled.h1`
    color: #ffffff;
    margin-bottom: 20px;
    font-size: 24px;
`

const Input__Image = styled.img`
    width: 140px;
    height: 205px;
    object-fit: cover;
    position: absolute;
    top: 55px;
    right: 30px;
    border-radius: 15px;
`

interface FormErrors {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
}

// ---

// Вспомогательные функции
// Функция для конвертации даты из формата DD.MM.YYYY в YYYY-MM-DD
const convertDateToISO = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
}

// Функция для конвертации даты из формата YYYY-MM-DD в DD.MM.YYYY
const convertDateToRussian = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
}

// ---

const CreateProductPage = () => {
    const router = useRouter();

    // Хук получения данных
    const { getSeminars, updateSeminar } = useSeminars();
    const [data, setData] = useState<SeminarType[]>([])

    const params = useParams()
    const editingSeminar = data?.find((seminar: SeminarType) => Number(seminar.id) === Number(params.id))
    const [isClient, setIsClient] = useState(false)
   
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Подгрузка при старте страницы
    useEffect(() => {
        const fetchData = async () => {
            try {
                const seminars = await getSeminars();
                setData(seminars);
            } catch (error) {
                console.error('Error fetching seminars:', error);
            }
        };
        fetchData();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [errorScale, setErrorScale] = useState(0)
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        photo: ''
    })

    // UseEffect для проверки на количество ошибок в полях, чтобы регулировать высоту формы
    useEffect(() => {
        if (errors.title || errors.description) {
            setErrorScale(errorScale + 1)
        }
    }, [errors])

    // Инициализация данных при загрузке семинара
    useEffect(() => {
        if (editingSeminar) {
            setFormData({
                title: editingSeminar.title,
                description: editingSeminar.description,
                date: convertDateToISO(editingSeminar.date), // Конвертируем при загрузке
                time: editingSeminar.time,
                photo: editingSeminar.photo || ''
            });
        }
    }, [editingSeminar]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        
        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно'
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно'
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsSubmitting(true)
        
        try {
            const updatedSeminar: SeminarType = {
                id: String(params.id),
                title: formData.title,
                description: formData.description,
                date: convertDateToRussian(formData.date), // Конвертируем обратно при сохранении
                time: formData.time,
                photo: formData.photo
            }
            
            await updateSeminar(Number(params.id), updatedSeminar)
            
            if (isClient) {
                router.push('/seminars')
            }
        } catch (error) {
            console.error('Ошибка при редактировании семинара:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleBack = () => {
        if (isClient) {
            router.back()
        }
    }

    // SSR
    if (!isClient) {
        return <CreateProductContainer>Загрузка...</CreateProductContainer>
    }

    return (
        <CreateProductContainer>
            <BackButton onClick={handleBack}>← Назад</BackButton>
            <PageTitle>Редактирование семинара</PageTitle>
                <Form onSubmit={handleSubmit} $errorScale={errorScale}>
                    {editingSeminar? (
                        <>
                            <Input__Image src={editingSeminar?.photo} alt="Изображение продукта" />
                            <FormGroup>
                                <Label htmlFor="title">Название</Label>
                                <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Введите название продукта"
                        />
                        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="date">Дата</Label>
                        <Input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="Введите дату"
                        />
                        {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="time">Время</Label>
                        <Input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="Введите дату"
                        />
                        {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="description">Описание</Label>
                        <TextArea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Введите описание продукта"
                        />
                        {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
                    </FormGroup>

                    <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                    </>
                    ) : (
                        <div>
                            <h1 style={{color: 'black'}}>Семинар не найден</h1>
                        </div>
                    )}
                    
                </Form>
        </CreateProductContainer>
    )
}

export default CreateProductPage 