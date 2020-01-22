import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {HomeScreen, PresenterScreen} from './screens';

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Presenter: {
    screen: PresenterScreen,
  },
});

export default createAppContainer(AppNavigator);
