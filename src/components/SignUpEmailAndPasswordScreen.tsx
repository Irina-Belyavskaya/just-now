import AppInput from "./AppInput";
import { Formik } from 'formik';
import { FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import { BaseStepType } from "../types/base-step.type";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setEmail, setPassword } from "../redux/sign-up/sign-up.reducer";
import SignUpButtons from "./SignUpButtons";
import { useState } from "react";
import repository from "../repository";

export default function SignUpEmailAndPasswordScreen({
  handleNext,
  onMain
}: BaseStepType) {
  const dispatch = useAppDispatch();
  const email = useAppSelector(state => state.signUpReducer.user_email);
  const password = useAppSelector(state => state.signUpReducer.user_password);
  const [isUniquenessError, setIsUniquenessError] = useState(false);

  const initialValues = {
    email,
    password
  }

  const schema = yup.object().shape({
    email: yup.string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string()
      .required('Required')
      .min(8, 'Password must contain at least 8 characters'),
  });

  const handleSubmitForm = async ({ email, password }: FieldValues) => {
    try {
      const { data: isTaken } = await repository.get(`/auth/email-is-taken/${email}`);
      if (isTaken) {
        setIsUniquenessError(true);
        return;
      }
      dispatch(setEmail(email));
      dispatch(setPassword(password));
      handleNext();
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
    }
  }


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSubmitForm(values);
      }}
      validationSchema={schema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched
      }) => (
        <>
          <AppInput
            onChangeText={(text) => {
              setFieldValue('email', text);
              setIsUniquenessError(false);
            }}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder={'Email'}
            isTouched={touched.email || isUniquenessError}
            errorMessage={errors.email || (isUniquenessError ? 'This email already exists' : '')}
          />
          <AppInput
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder={'Password'}
            isTouched={touched.password}
            errorMessage={errors.password}
            autoCorrect={false}
            secureTextEntry={true}
            textContentType={'password'}
          />
          <SignUpButtons
            handleNext={handleNext}
            onMain={onMain}
            handleSubmit={() => handleSubmit()}
          />
        </>
      )}
    </Formik>
  )
}