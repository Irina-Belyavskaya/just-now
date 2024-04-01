import { Text, TextInput, View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Formik, FormikState, useFormik } from 'formik';
import { useAuth } from '../../context/auth-context';
import * as yup from 'yup';
import { Button } from 'react-native-paper';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import repository from '@/src/repository';
import axios from "axios";

export default function SignIn() {
  const { signIn } = useAuth();


  const schema = yup.object().shape({
    email: yup.string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string()
      .required('Required')
      .min(8, 'Password must contain at least 8 characters'),
  });

  const handleSubmitForm = async (data: FieldValues, resetForm: (nextState?: Partial<FormikState<{
    email: string;
    password: string;
  }>> | undefined) => void) => {
    
    try {
      const dto = {
        user_email: data.email,
        user_password: data.password
      };
      console.log("dto: ", dto);
      const { data: responseInfo, status } = await repository.post("/auth/sign-in", dto);
      console.log(responseInfo);
      console.log(status);
      resetForm();
      signIn(responseInfo.access_token);
      router.replace('/')
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/background.jpg')}
        style={styles.imageBackground}
        resizeMode='cover'
      >
        <Text style={styles.title}>
          Sign In
        </Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, { resetForm }) => {
            handleSubmitForm(values, resetForm);
          }}
          validationSchema={schema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldTouched, touched }) => (
            <View style={styles.formWrap}>

              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
                  autoFocus
                  placeholder="Email Address"
                />
                {touched.email && errors.email ? (
                  <Text style={styles.error}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  style={[styles.input, [styles.input, touched.password && errors.password ? styles.errorInput : null]]}
                  placeholder="Password"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType={'password'}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
              </View>

              <Button
                onPress={handleSubmit}
                mode="contained"
                type="submit"
                loading={isSubmitting}
                disabled={false}
                style={styles.button}
                labelStyle={{ color: 'white' }}
                uppercase
              >
                Submit
              </Button>
            </View>
          )}
        </Formik>
        <Link href={"/sign-up"} style={styles.promt}>
          Don't have an account?
        </Link>
      </ImageBackground>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  formWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    marginTop: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 40,
    fontFamily: "Raleway_700Bold"
  },
  error: {
    fontSize: 14,
    color: '#cc0000',
    fontWeight: 'bold',
    marginLeft: 3
  },
  wrapInput: {
    width: '80%',
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center'
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  errorInput: {
    borderColor: '#cc0000',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    width: '80%',
    paddingVertical: 5,
    fontSize: 20
  },
  promt: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 50,
  }
});