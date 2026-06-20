import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaPostesProximos from './src/telas/TelaPostesProximos';
import TelaReportarProblema from './src/telas/TelaReportarProblema';
import TelaMeusRelatos from './src/telas/TelaMeusRelatos';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="PostesProximos">
        <Stack.Screen
          name="PostesProximos"
          component={TelaPostesProximos}
          options={({ navigation }) => ({
            title: 'Postes Próximos',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MeusRelatos')}
                style={estilos.botaoHeader}
              >
                <Text style={estilos.textoBotaoHeader}>Meus Relatos</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Reportar"
          component={TelaReportarProblema}
          options={{ title: 'Reportar Problema' }}
        />
        <Stack.Screen
          name="MeusRelatos"
          component={TelaMeusRelatos}
          options={{ title: 'Meus Relatos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  botaoHeader: {
    paddingHorizontal: 8,
  },
  textoBotaoHeader: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});
