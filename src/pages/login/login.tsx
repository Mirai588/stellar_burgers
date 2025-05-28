import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  logInUser,
  selectIsAuthenticated
} from '../../services/slices/UserSlice';
import { Navigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

type LoginFormValues = { email: string; password: string };

export const Login: FC = () => {
  const { values, setValues } = useForm<LoginFormValues>({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const setEmail: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setValues((prev) => {
      const nextEmail = typeof value === 'function' ? value(prev.email) : value;
      return { ...prev, email: nextEmail };
    });

  const setPassword: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setValues((prev) => {
      const nextPass =
        typeof value === 'function' ? value(prev.password) : value;
      return { ...prev, password: nextPass };
    });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(logInUser(values));
  };

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={setEmail}
      password={values.password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
