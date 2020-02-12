import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import ReadMore from 'react-native-read-more-text';
import Lightbox from 'react-native-lightbox';

import events from '../../events';

// Reusable Alert item component
class ListItem extends React.Component {
    state = {
        urgency: '',
        urgencyColor: '',
        hasImage: false,
        showImage: false
    };

    componentDidMount() {
        // Check for image
        if (this.props.image !== ''){
            this.setState({ hasImage: true });
        }
    }

    // Expand text link
    _renderTruncatedFooter = (handlePress) => {
        return <Text style={{color: '#0080ff', marginTop: 5}} onPress={handlePress}> Read more </Text>
    };

    // Retract text link
    _renderRevealedFooter = (handlePress) => {
        return <Text style={{color: '#0080ff', marginTop: 5}} onPress={handlePress}> Show less </Text>
    };

    render() {
        return (
            <Card style={styles.wrapper}>
                <Card.Title title={this.props.title} subtitle={this.props.organization} />
                <Card.Content>
                    <Text style={{ fontWeight: 'bold' }}>{this.props.location}</Text>
                    <Text style={{ fontWeight: 'bold' }}>{this.props.time}</Text>
                    <ReadMore numberOfLines={3} renderTruncatedFooter={this._renderTruncatedFooter} renderRevealedFooter={this._renderRevealedFooter}>
                        <Text>{this.props.description}</Text>
                    </ReadMore>
                    { this.state.hasImage ? // Show image if applicable. Opens lightbox if tapped.
                        <View style={{ marginTop: 15, marginBottom: 5 }}>
                            <Lightbox navigator={this.props.navigator} backgroundColor='rgba(0,0,0,0.75)' renderContent={() => <Image style={{height: 300}} source={{uri: this.props.image}} />}>
                                <Image
                                    style={{height: 150, borderRadius: 3 }}
                                    source={{uri: this.props.image}}
                                />
                            </Lightbox>
                        </View>
                        : null }
                </Card.Content>
            </Card>
        )
    }
}
ListItem.defaultProps = {
    image: '' // No image by default
};

export default function List(props) {
    return <ScrollView>
        <View style={{ height: 15 }} />
        {events.map( item =>
            <ListItem
                key={item.title + item.organization}
                title={item.title}
                organization={item.organization}
                description={item.description}
                location={item.location}
                time={item.time}
            />
        )}
    </ScrollView>;
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        backgroundColor: "white",
        flex: 1,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 15,
        elevation: Platform.OS === 'ios' ? 3 : 5,
        borderRadius: 5
    }
});