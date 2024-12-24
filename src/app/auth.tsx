import { useForm, Controller } from 'react-hook-form'
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Redirect, Stack } from 'expo-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'react-native-toast-notifications'
import { useAuth } from './providers/auth-provider'

const AuthSchema = zod.object({
  email: zod.string().email({ message: 'invalid email' }),
  password: zod.string().min(6, { message: 'password must be at least 6 characters' })
})
export default function Auth() {
  const toast = useToast();
  const { session } = useAuth()
  console.log(session);

  if (session) return <Redirect href={'/'} />
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  // handlesubmit function will check the data agains schema and if there is an error
  //it will pass it to the error object in controller
  const signIn = async (data: zod.infer<typeof AuthSchema>) => {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return toast.show(error.message, { type: 'warning', placement: 'top' })
    toast.show('signed in successfully',
      { type: 'success', placement: 'top' }
    )


  }

  const signUp = async (data: zod.infer<typeof AuthSchema>) => {
    const { error } = await supabase.auth.signUp(data)
    if (error) {
      console.log(error);

      return toast.show(error.message,
      { type: 'warning', placement: 'top' })
    }
    return toast.show('signed up successfully',
      { type: 'success', placement: 'top' }
    )
  }
  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }}
      style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>welcome</Text>
        <Text style={styles.subtitle}>Please authenticate to countinue</Text>
        <Controller control={control} render={(
          { field: { value, onChange }, fieldState: { error } }) =>
          <>
            <TextInput
              placeholder='email'
              style={styles.input}
              onChangeText={onChange}
              autoCapitalize='none'
              editable={!formState.isSubmitting}
              value={value} />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        }
          name='email' />

        <Controller control={control} render={(
          { field: { value, onChange }, fieldState: { error } }) =>
          <>
            <TextInput
              placeholder='password'
              style={styles.input}
              onChangeText={onChange}
              autoCapitalize='none'
              editable={!formState.isSubmitting}
              secureTextEntry
              value={value} />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        }
          name='password' />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(signIn)}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={handleSubmit(signUp)}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 32,
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6a1b9a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '90%',
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
  },
  signUpButtonText: {
    color: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'left',
    width: '90%',
  },
});