import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import NavBar from './components/Nav';
import Home from './screens/home/Home';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#fff',
        secondary: '#f04141',
        main: '#0052a5',
        white: '#ffffff'
    }
};

export default class App extends React.Component {
    state = {
        events: []
    };

    render() {
        return <PaperProvider theme={theme}>
            { Platform.OS === 'ios' ? // Set iOS statusbar to white
                    <StatusBar barStyle='light-content'/>
                    : null }
            <NavBar title={"Event Proximity"} />
            <View style={{ flex: 1 }}>
                <Home/>
            </View>
        </PaperProvider>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});