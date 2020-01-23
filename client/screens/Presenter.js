import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import withObservables from '@nozbe/with-observables';
import {View, Text, TextInput} from 'react-native';
import {database} from '../database';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
  },
  submit: {
    backgroundColor: 'orange',
    padding: 20,
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
  },
});

const PresenterForm = ({presenter, onUpdate, onChange}) => {
  return (
    <View>
      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        value={presenter.role}
        onChangeText={role => onChange({role})}
      />
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={presenter.firstName}
        onChangeText={firstName => onChange({firstName})}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={presenter.lastName}
        onChangeText={lastName => onChange({lastName})}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        multiline
        style={styles.input}
        value={presenter.bio}
        onChangeText={bio => onChange({bio})}
      />

      <TouchableOpacity style={styles.submit} onPress={onUpdate}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export class PresenterScreen extends React.Component {
  state = {
    presenter: null,
    updates: {},
    loading: true,
  };

  componentDidMount() {
    const presenter = this.props.navigation.getParam('presenter');
    this.setState(
      {
        presenter,
        updates: {
          role: presenter.role,
          firstName: presenter.firstName,
          lastName: presenter.lastName,
          bio: presenter.bio,
        },
      },
      () => {
        this.setState({loading: false});
      },
    );
  }

  handleUpdate = async () => {
    await database.action(async () => {
      await this.state.presenter.updatePresenter(this.state.updates);
    });

    console.log(this.state.presenter);
    console.log(this.state.updates);
    // console.log(this.props.navigation.getParam('presenter'));
  };

  onChange = changes => {
    this.setState({updates: {...this.state.updates, ...changes}});
  };

  render() {
    console.log(this.state.updates);
    return (
      <View style={{padding: 10}}>
        {!this.state.loading && (
          <PresenterForm
            onChange={this.onChange}
            onUpdate={this.handleUpdate}
            presenter={this.state.updates}
          />
        )}
      </View>
    );
  }
}
