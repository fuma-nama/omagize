import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { layouts, NormalLayout } from './layouts';
import { firebase, initFirebase } from '@omagize/api';
import { QueryStatus, LoadingPanel } from '@omagize/ui/components';
import { usePageStore } from '@omagize/data-access-store';
import { theme, useColorsExtend } from '@omagize/ui/theme';
import { initGateway } from './gateway';
import { PrivateChatModal } from '@omagize/views/chat';
import { initClient, useLoginQuery, client } from '@omagize/data-access-api';

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
  const { textColorPrimary, globalBg, scrollbar } = useColorsExtend(
    {
      scrollbar: 'rgba(0, 0, 0, 0.2)',
    },
    {
      scrollbar: 'rgba(255, 255, 255, 0.2)',
    }
  );

  return (
    <Box
      w="full"
      h="full"
      color={textColorPrimary}
      bg={globalBg}
      sx={{
        '*::-webkit-scrollbar-thumb': {
          borderRadius: '10px',
          bgColor: scrollbar,
        },
      }}
    >
      <QueryStatus query={query} error="Failed to login" loading={<LoadingPanel size="lg" />}>
        <RootRoutes loggedIn={query.data != null} />
      </QueryStatus>
    </Box>
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

const root = createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={client}>
      <React.StrictMode>
        <BrowserRouter>
          <Modals />
          <Pages />
        </BrowserRouter>
      </React.StrictMode>
    </QueryClientProvider>
  </ChakraProvider>
);
