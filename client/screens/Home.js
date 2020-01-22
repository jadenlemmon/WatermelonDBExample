import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {synchronize} from '@nozbe/watermelondb/sync';
import {NavigationActions} from 'react-navigation';
import {database} from '../database';

const syncData = async () => {
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      const response = await fetch(
        `http://127.0.0.1:7000/sync?last_pulled_at=${lastPulledAt}`,
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const {changes, timestamp} = await response.json();
      console.log(changes);
      return {changes, timestamp};
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      const response = await fetch(
        `http://127.0.0.1:7000/sync?last_pulled_at=${lastPulledAt}`,
        {
          method: 'POST',
          body: JSON.stringify(changes),
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
};

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
    <TouchableOpacity
      onPress={() => onSelect(presenter.id)}
      style={[styles.item]}>
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

const PresenterList = withObservables(['presenters'], () => ({
  presenters: database.collections.get('presenters').query(),
}))(({presenters, onSelect}) => (
  <View>
    {console.log(presenters)}
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
    // await database.action(async () => {
    //   const newPresenter = await presentersCollection.create(presenter => {
    //     presenter.role = 'test role';
    //     presenter.firstName = 'test firstname';
    //     presenter.lastName = 'test lastname';
    //     presenter.bio = 'test bio';
    //   });
    // });
    // console.log(allPosts);
    await syncData();
  }

  onSelect = id => {
    console.log(this.props.navigation);
    this.props.navigation.navigate({
      routeName: 'Presenter',
      params: {id},
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
