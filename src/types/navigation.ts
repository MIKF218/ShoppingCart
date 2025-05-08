import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './index';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack (Authentication)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: NavigatorScreenParams<TabParamList>;
  ProductDetail: { product: Product };
  Checkout: undefined;
  OrderSuccess: undefined;
};

// Home Stack (nested in Tab)
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
};

// Main Tab Navigator
export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Profile: undefined;
};

// Add this new type for search stack
export type SearchStackParamList = {
  Search: undefined;
  ProductDetail: { product: Product };
};

// Add this new type for the bottom tab navigation
export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, T>,
    NativeStackNavigationProp<HomeStackParamList>
  >;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>; 