import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  HomeScreen,
  PresenterScreen,
  EventsScreen,
  EventScreen,
} from './screens';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const PresenterNavigation = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Presenter: {
    screen: PresenterScreen,
  },
});

const EventNavigation = createStackNavigator({
  Events: {
    screen: EventsScreen,
  },
  Event: {
    screen: EventScreen,
  },
});

const TabNavigator = createBottomTabNavigator({
  Home: PresenterNavigation,
  Events: EventNavigation,
});

export default createAppContainer(TabNavigator);
