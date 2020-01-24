import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {database} from '../database';
import {PresenterList} from './Home';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 350,
  },
});

const EventPresenterList = withObservables(['event'], ({event}) => ({
  event,
  presenters: event.presenters,
}))(({event, onSelect, presenters}) => (
  <View>
    <Text>{event.name}</Text>
    <PresenterList presenters={presenters} />
  </View>
));

export class EventScreen extends React.Component {
  render() {
    const event = this.props.navigation.getParam('event');
    console.log(event);
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        {!!event && <EventPresenterList event={event} />}
      </View>
    );
  }
}
