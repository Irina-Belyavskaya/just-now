import { Text, TextInput, View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Formik, FormikState, useFormik } from 'formik';
import { useAuth } from '../../context/auth-context';
import * as yup from 'yup';
import { Button } from 'react-native-paper';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'expo-router';

export default function SignUp() {
  const { signIn } = useAuth();

  const schema = yup.object().shape({
    name: yup.string()
      .required('Required'),
    email: yup.string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string()
      .required('Required')
      .min(8, 'Password must contain at least 8 characters'),
  });

  const handleSubmitForm = (data: FieldValues, resetForm: (nextState?: Partial<FormikState<{
    name: string;
    email: string;
    password: string;
  }>> | undefined) => void) => {
    const dto = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    console.log("dto: ", dto);
    resetForm();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/background.jpg')}
        style={styles.imageBackground}
        resizeMode='cover'
      >
        <Text style={styles.title}>
          Sign Up
        </Text>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          onSubmit={(values, { resetForm }) => {
            handleSubmitForm(values, resetForm);
          }}
          validationSchema={schema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldTouched, touched }) => (
            <View style={styles.formWrap}>
              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  style={[styles.input, touched.name && errors.name ? styles.errorInput : null]}
                  autoFocus
                  placeholder="Name"
                />
                {touched.name && errors.name ? (
                  <Text style={styles.error}>{errors.name}</Text>
                ) : null}
              </View>

              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
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
                disabled={isSubmitting}
                style={styles.button}
                labelStyle={{ color: 'white' }}
                uppercase
              >
                Submit
              </Button>
            </View>
          )}
        </Formik>
        <Link href={"/sign-in"} style={styles.promt}>
          Already have an account?
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
    marginTop: 25,
  }
});