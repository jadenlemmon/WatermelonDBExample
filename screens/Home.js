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
import {Q} from '@nozbe/watermelondb';
import {NavigationActions} from 'react-navigation';
import {database} from '../database';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ccc',
    padding: 10,
    width: 300,
  },
});

const navigateAction = NavigationActions.navigate({
  routeName: 'Presenter',
  params: {},
});

const Presenter = ({presenter, onSelect}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(presenter.id)}
      style={[styles.item]}>
      <Text>{presenter.role}</Text>
      <Text>{presenter.firstName}</Text>
      <Text>{presenter.lastName}</Text>
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
  }

  onSelect = () => {
    this.props.navigation.dispatch(navigateAction);
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
        <Text>Presenters</Text>
        <TouchableHighlight onPress={this.triggerUpdate}>
          <Text>Trigger Update</Text>
        </TouchableHighlight>
        <PresenterList onSelect={this.onSelect} />
      </View>
    );
  }
}
