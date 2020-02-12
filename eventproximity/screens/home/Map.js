import React from 'react';
import { Image, InteractionManager, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Card, FAB } from 'react-native-paper';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import events from '../../events';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            follow: true,
            returning: false,

            latitude: 0,
            longitude: 0,

            currentlat: 0,
            currentlng: 0,
            error: null,

            displayEvent: false,
            selectedEvent: {}
        };
    }

    componentDidMount() {
        this.setInitialLocation(); // Set initial location
        // Load content after screen transition (prevents delay from side menu)
        if (this.state.latitude === 0 && this.state.longitude === 0) {
            InteractionManager.runAfterInteractions( () => {
                setTimeout( function () {
                    this.setState( { loading: false } );
                }.bind( this ), 30 ) // Loading hangs without timeout function, do not remove even though it is set to 0
            } );
        }
    }

    // Gets user location using iOS' location services
    _getLocation = async() => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION); // Check location permissions
        if (status !== 'granted') { console.log('No location permissions') }
        return await Location.getCurrentPositionAsync({}) // Get user location
    };

    setInitialLocation = () => {
        this._getLocation().then( location =>
            this.setState({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        );
    };

    // Animates camera to new location
    moveCamera = () => {
        this._getLocation().then(location => {
            this.mapRef.animateCamera({
                center: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
            }, 500);
            this.setState({ returning: false })
        })
    };

    locationChange = () => {
        if (this.state.follow && !this.state.returning) { // Returning state checked to prevent camera shaking when user moves while transition animation plays
            this.moveCamera()
        }
    };

    disableFollow = () => {
        this.setState({ follow: false }) // Disable camera following user location and show return button
    };

    enableFollow = () => {
        this.setState({ follow: true, returning: true }); // Hide return button
        this.moveCamera();
    };

    showEvent = (data) => { this.setState({ selectedEvent: data, displayEvent: true }) };

    render() {
        return <View style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                camera={{
                    center: {
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 0,
                    zoom: 19
                }}
                ref={ref => this.mapRef = ref}
                onUserLocationChange={this.locationChange}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={false}
                onPanDrag={this.disableFollow}
            >
                {events.map(item => <Marker key={item.title + item.organization} data={item} showEvent={this.showEvent} />)}
            </MapView>
            <Modal isVisible={!this.state.follow} hasBackdrop={false} coverScreen={false} animationIn={'fadeIn'} animationOut={'fadeOut'}>
                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    <FAB
                        style={{ backgroundColor: 'white' }}
                        icon={'crosshairs-gps'}
                        onPress={this.enableFollow}
                    />
                </View>
            </Modal>
            <Modal isVisible={this.state.displayEvent} style={{ margin: 0 }} onBackButtonPress={() => this.setState({ displayEvent: false })}>
                <Card style={styles.wrapper}>
                    <Card.Title title={this.state.selectedEvent.title} subtitle={this.state.selectedEvent.organization} />
                    <Card.Content>
                        <Text style={{ fontWeight: 'bold' }}>{this.state.selectedEvent.location}</Text>
                        <Text style={{ fontWeight: 'bold' }}>{this.state.selectedEvent.time}</Text>
                        <Text>{this.state.selectedEvent.description}</Text>
                    </Card.Content>
                </Card>
                <FAB
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        backgroundColor: '#242424',
                        right: 30,
                        top: 15,
                        borderWidth: 1.5,
                        borderColor: 'rgba(255,255,255,0.75)'
                    }}
                    small
                    icon={'close'}
                    onPress={() => this.setState({ displayEvent: false })}
                />
            </Modal>
        </View>
    }
}

function Marker(props) {
    return <MapView.Marker
        coordinate={{latitude: props.data.coordinates.lat,
            longitude: props.data.coordinates.lng}}
        title={props.data.title}
        description={props.data.organization}
        onCalloutPress={() => props.showEvent(props.data)}
    />
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        backgroundColor: "white",
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 15,
        elevation: Platform.OS === 'ios' ? 3 : 5,
        borderRadius: 5
    }
});