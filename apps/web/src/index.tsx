import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import 'react-image-crop/dist/ReactCrop.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { layouts, NormalLayout, RootLayout } from './layouts';
import { useLoginQuery } from '@omagize/api';
import LoadingScreen from './components/screens/LoadingScreen';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * We will only update data with Gateway
       */
      staleTime: Infinity,
      retry: 1,
    },
  },
});

function RootRoutes({ loggedIn }: { loggedIn: boolean }) {
  function mapNestedLayout(layout: NormalLayout, key: number) {
    if (layout.index === true) {
      return <Route index key={key} element={layout.component} />;
    } else {
      return (
        <Route key={key} path={layout.path} element={layout.component}>
          {layout.subLayouts && layout.subLayouts.map(mapNestedLayout)}
        </Route>
      );
    }
  }

  function mapLayout(layout: RootLayout, key: number) {
    if (layout.requireLogin !== loggedIn) {
      return null;
    }

    return mapNestedLayout(layout, key);
  }

  return (
    <Routes>
      {layouts.map(mapLayout)}

      <Route
        path="*"
        element={<Navigate to={loggedIn ? '/user' : '/auth'} />}
      />
    </Routes>
  );
}

function Pages() {
  const query = useLoginQuery();

  if (query.isLoading || query.error) return <LoadingScreen />;
  return <RootRoutes loggedIn={query.data != null} />;
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
