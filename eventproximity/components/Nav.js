import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";

// Main AppBar for most pages
export default function NavBar(props) {
    return <Appbar.Header style={styles.menubar}>
        <Appbar.Content title={props.title}/>
    </Appbar.Header>
}

// Alternate appbar with back button instead of menu button
export function BackNav(props) {
    return (
        <Appbar.Header style={styles.menubar}>
            <Appbar.Action
                icon="arrow-back"
                onPress={props.close}
            />
            <Appbar.Content title={props.title}/>
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    menubar: {
        backgroundColor: '#260859',
        color: '#fff'
    }
});