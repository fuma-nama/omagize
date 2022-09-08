import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/theme';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import routes, {dynamicRoutes} from "./routes";
import {layouts, LayoutType} from "./layouts";
import {useLoggedInQuery} from "./api/AccountAPI";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1
		}
	}
})
function getRoutes(layout: LayoutType): any {
	const mapper = (route: IRoute, key: number) => {
		if (route.layout === layout.path) {
			return <Route path={route.layout + route.path} element={route.component} key={key} />
		} else {
			return null;
		}
	}

	return [
		...routes.map(mapper),
		...dynamicRoutes.map(mapper)
	]
}

function Pages() {
	const query = useLoggedInQuery();

	if (query.isLoading) return <></>
	const loggedIn = query.data

	return <Routes>
		{
			layouts
				.filter(layout => layout.requireLogin == loggedIn)
				.map((layout, i) =>
					<Route key={i} path={layout.path} element={layout.component}>
						{getRoutes(layout)}
						{layout.index && <Route index element={<Navigate to={layout.index}/>}/>}
						{layout.default && <Route path="*" element={<Navigate to={layout.default}/>}/>}
					</Route>
				)
		}

		<Route path='*' element={loggedIn? <Navigate to="/user" /> : <Navigate to="/auth" />} />
	</Routes>
}

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<QueryClientProvider client={client}>
			<React.StrictMode>
				<BrowserRouter>
					<Pages />
				</BrowserRouter>
			</React.StrictMode>
		</QueryClientProvider>
	</ChakraProvider>,
	document.getElementById('root')
);