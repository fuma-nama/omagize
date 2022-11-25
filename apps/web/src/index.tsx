import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import 'react-image-crop/dist/ReactCrop.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { layouts, NormalLayout } from './layouts';
import { client, firebase, initClient, initFirebase, useLoginQuery } from '@omagize/api';
import { QueryStatus } from 'components/panel/QueryPanel';
import { initGateway } from 'gateway';
import { usePageStore } from 'stores/PageStore';
import { PrivateChatModal } from 'views/admin/chat/dm/PrivateChat';
import LoadingPanel from 'components/panel/LoadingPanel';

initClient();
initFirebase();
initGateway(firebase.auth);
function RootRoutes({ loggedIn }: { loggedIn: boolean }) {
  function mapNestedLayout(layout: NormalLayout, key: string | number) {
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
  return (
    <Routes>
      {layouts.map((layout, key) =>
        layout.loggedIn === loggedIn ? mapNestedLayout(layout, key) : null
      )}

      <Route path="*" element={<Navigate to={loggedIn ? '/user' : '/auth'} />} />
    </Routes>
  );
}

function Pages() {
  const query = useLoginQuery();

  return (
    <QueryStatus query={query} error="Failed to login" loading={<LoadingPanel size="lg" />}>
      <RootRoutes loggedIn={query.data != null} />
    </QueryStatus>
  );
}

function Modals() {
  const [dm, setDM] = usePageStore((s) => [s.dm, s.setDM]);

  return (
    <>
      <PrivateChatModal user={dm} onClose={() => setDM(null)} />
    </>
  );
}

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={client}>
      <React.StrictMode>
        <BrowserRouter>
          <Modals />
          <Pages />
        </BrowserRouter>
      </React.StrictMode>
    </QueryClientProvider>
  </ChakraProvider>,
  document.getElementById('root')
);
