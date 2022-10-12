import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import 'react-image-crop/dist/ReactCrop.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { layouts, NestedLayout, RootLayout } from './layouts';
import { useLoginQuery } from './api/AccountAPI';
import { getRoutesByLayout } from './utils/RouteUtil';
import LoadingScreen from './components/screens/LoadingScreen';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

function Pages() {
  const query = useLoginQuery();

  if (query.isLoading || query.error) return <LoadingScreen />;
  const loggedIn = query.data != null;

  function mapNestedLayout(layout: NestedLayout, key: number) {
    return (
      //@ts-ignore
      <Route
        key={key}
        index={layout.index}
        path={layout.path}
        element={layout.component}
      >
        {layout.routes && getRoutesByLayout(layout.routes)}
        {layout.subLayouts && layout.subLayouts.map(mapNestedLayout)}
      </Route>
    );
  }

  function mapLayout(layout: RootLayout, key: number) {
    if (layout.requireLogin !== loggedIn) {
      return null;
    }

    switch (layout.type) {
      case 'normal':
        return mapNestedLayout(layout, key);
      case 'auto':
        return (
          <Route key={key} path={layout.path} element={layout.component}>
            {getRoutesByLayout(layout.path)}
            {layout.index && (
              <Route index element={<Navigate to={layout.index} />} />
            )}
            {layout.default && (
              <Route path="*" element={<Navigate to={layout.default} />} />
            )}
          </Route>
        );
    }
  }

  return (
    <Routes>
      {layouts.map(mapLayout)}

      <Route
        path="*"
        element={<Navigate to={loggedIn ? '/user/default' : '/auth'} />}
      />
    </Routes>
  );
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
