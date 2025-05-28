import { useState, ChangeEvent } from 'react';

/**
 * Универсальный хук для работы с формами.
 * @template T
 * @param initialValues Начальные значения формы.
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  return { values, handleChange, setValues } as const;
}
