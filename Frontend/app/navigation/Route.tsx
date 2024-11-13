import React from 'react';
import { ThemeContextProvider } from '../constants/ThemeContext';
import { Text } from 'react-native';
import StackNavigator from './StackNavigator';
import {SocketProvider} from "../socket/SocketProvider";

const Route = () => {

	return (
		<SocketProvider>
			<ThemeContextProvider>
				<StackNavigator/>
			</ThemeContextProvider>
		</SocketProvider>
	)
  
}

export default Route;