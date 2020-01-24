import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {database} from '../database';
import {syncData} from '../database/sync';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 350,
  },
});

const Presenter = ({presenter, onSelect}) => {
  return (
    <TouchableOpacity onPress={() => onSelect(presenter)} style={[styles.item]}>
      <Text style={{fontSize: 20}}>
        {presenter.firstName} {presenter.lastName}
      </Text>
      <Text>{presenter.role}</Text>
    </TouchableOpacity>
  );
};

const enhance = withObservables(['presenter'], ({presenter}) => ({
  presenter,
}));

const EnhancedPresenter = enhance(Presenter);

export const PresenterList = withObservables(['presenters'], () => ({
  presenters: database.collections.get('presenters').query(),
}))(({presenters, onSelect}) => (
  <View>
    <FlatList
      data={presenters}
      renderItem={({item}) => (
        <EnhancedPresenter presenter={item} onSelect={onSelect} />
      )}
      keyExtractor={item => item.id}
    />
  </View>
));

export class HomeScreen extends React.Component {
  async componentDidMount() {
    const start = new Date();

    await syncData();

    const end = new Date();
    const time = end.getTime() - start.getTime();

    console.log('Sync finished in', time, 'ms');
  }

  onSelect = presenter => {
    this.props.navigation.navigate({
      routeName: 'Presenter',
      params: {presenter},
    });
  };

  triggerUpdate = async () => {
    await database.action(async () => {
      const presentersCollection = database.collections.get('presenters');
      const presenter = await presentersCollection.find('jxr78upyvk72f7p0');
      await presenter.update(presenter => {
        presenter.firstName = 'foobar123';
      });
    });
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <PresenterList onSelect={this.onSelect} />
      </View>
    );
  }
}
