import { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import styles from '../styles/LoginScreenStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '@rneui/base';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || password.length < 6) {
      setError('E-mail ou senha inválidos');
      return;
    }
    setError('');
    navigation.navigate('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/mediway-paciente.jpg")}
          style={styles.logo}
        />
        <Text style={styles.slogan}>Facilite o cuidado, fortaleça o amor</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <View style={{ position: "relative" }}>
            <TextInput
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconBtn}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#2e7d32"
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Cadastrar novo paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate("GoogleRegister")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/google-logo.png",
              }}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text style={styles.socialText}>Continuar com Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
          onPress={() => navigation.navigate("FacebookRegister")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/facebook-new.png",
              }}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text style={[styles.socialText, { color: "#fff" }]}>
              Continuar com Facebook
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.note}>
          Caso tenha conta Mediway como cuidador ou equipe multidisciplinar não
          precisa criar outra conta.
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
