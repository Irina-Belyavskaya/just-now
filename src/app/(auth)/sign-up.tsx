import { Text, TextInput, View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Formik, FormikState } from 'formik';
import { useAuth } from '../../context/auth-context';
import * as yup from 'yup';
import { Button } from 'react-native-paper';
import { FieldValues } from 'react-hook-form';
import { Link, router } from 'expo-router';
import repository from '@/src/repository';

export default function SignUp() {
  const { signUp } = useAuth();

  const schema = yup.object().shape({
    nickname:yup.string()
      .required('Required'),
    // name: yup.string()
    //   .required('Required'),
    // surname: yup.string()
    //   .required('Required'),
    email: yup.string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string()
      .required('Required')
      .min(8, 'Password must contain at least 8 characters'),
    confirmPassword:yup.string()
      .required('Required')
      .min(8, 'Password must contain at least 8 characters'),

  });

  const handleSubmitForm = async (data: FieldValues, resetForm: (nextState?: Partial<FormikState<{
    // name: string;
    email: string;
    password: string;
    // surname: string;
    confirmPassword: string;
    nickname: string;
  }>> | undefined) => void) => {
    try {
      const dto = {
        user_name: "Name",
        user_email: data.email,
        user_password: data.password,
        user_confirmPassword: data.confirmPassword,
        user_nickname: data.nickname,
        user_surname:"Surname",
        user_profile_picture_url: ''
      };
      console.log("dto: ", dto);
      const { data: responseInfo, status } = await repository.post("/auth/sign-up", dto);
      console.log(responseInfo);
      console.log(status);
      signUp(responseInfo.access_token);
      resetForm();
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
        source={require('../../../assets/cat.jpg')}
        style={styles.imageBackground}
        resizeMode='cover'
      >
        <Text style={styles.title}>
          Sign Up
        </Text>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', nickname: '' }}
          onSubmit={(values, { resetForm }) => {
            handleSubmitForm(values, resetForm);
          }}
          validationSchema={schema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldTouched, touched }) => (
            <View style={styles.formWrap}>
              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('nickname')}
                  onBlur={handleBlur('nickname')}
                  value={values.nickname}
                  style={[styles.input, touched.nickname && errors.nickname ? styles.errorInput : null]}
                  autoFocus
                  placeholder="Nickname"
                  autoCapitalize={'none'}
                />
                {touched.nickname && errors.nickname ? (
                  <Text style={styles.error}>{errors.nickname}</Text>
                ) : null}
              </View>

              {/* <View style={styles.wrapInput}>
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
              </View> */}

              {/* <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('surname')}
                  onBlur={handleBlur('surname')}
                  value={values.name}
                  style={[styles.input, touched.surname && errors.surname ? styles.errorInput : null]}
                  autoFocus
                  placeholder="Surname"
                />
                {touched.name && errors.surname ? (
                  <Text style={styles.error}>{errors.surname}</Text>
                ) : null}
              </View> */}

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
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType={'password'}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
              </View>

              <View style={styles.wrapInput}>
                <TextInput
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  style={[styles.input, [styles.input, touched.confirmPassword && errors.confirmPassword ? styles.errorInput : null]]}
                  placeholder="Confirm password"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType={'password'}
                />
                {touched.confirmPassword && errors.confirmPassword ? (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
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