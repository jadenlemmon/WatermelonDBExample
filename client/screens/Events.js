import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {database} from '../database';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 350,
  },
});

const Event = ({event, onSelect}) => {
  return (
    <TouchableOpacity onPress={() => onSelect(event)} style={[styles.item]}>
      <Text style={{fontSize: 20}}>{event.name}</Text>
    </TouchableOpacity>
  );
};

const EventsList = withObservables(['events'], () => ({
  events: database.collections.get('events').query(),
}))(({events, onSelect}) => (
  <View>
    <FlatList
      data={events}
      renderItem={({item}) => <Event event={item} onSelect={onSelect} />}
      keyExtractor={item => item.id}
    />
  </View>
));

export class EventsScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <EventsList
          onSelect={event => {
            this.props.navigation.navigate({
              routeName: 'Event',
              params: {event},
            });
          }}
        />
      </View>
    );
  }
}
