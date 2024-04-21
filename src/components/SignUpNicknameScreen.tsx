import AppInput from "./AppInput";
import { Formik } from 'formik';
import { FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import { BaseStepType } from "../types/base-step.type";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setNickname } from "../redux/sign-up.reducer";
import { useState } from "react";
import SignUpButtons from "./SignUpButtons";
import repository from "../repository";

export default function SignUpNicknameScreen ({
  handleNext, 
  onMain
}: BaseStepType) {
  const dispatch = useAppDispatch();
  const nickname = useAppSelector(state => state.signUp.nickname);
  const [isUniquenessError, setIsUniquenessError] = useState(false);

  const initialValues = {
    nickname
  }

  const schema = yup.object().shape({
    nickname:yup.string()
      .required('Required')
      .min(2, 'Nickname must contain at least 2 characters'),
  });

  const handleSubmitForm = async ({ nickname }: FieldValues) => {
    try {
      const {data: isTaken} = await repository.get(`/auth/nickname-is-taken/${nickname}`);
      if (isTaken) {
        setIsUniquenessError(true);
        return;
      }
      dispatch(setNickname(nickname));
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
            setFieldValue('nickname', text);
            setIsUniquenessError(false);
          }}
          onBlur={handleBlur('nickname')}
          value={values.nickname}             
          placeholder={'Nickname'}
          isTouched={touched.nickname || isUniquenessError}
          errorMessage={errors.nickname || ( isUniquenessError ? 'This nickname is already taken' : '')}
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

