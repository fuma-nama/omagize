import { createContext, ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type PageContextType = {
  selectedGroup?: string;
  setSelectedGroup?: (group: string) => void;
  info?: NavbarInfo;
  setInfo?: (info: NavbarInfo) => void;
};

export type NavbarInfo = {
  title: string;
};

export const PageContext = createContext<PageContextType>({});

export function PageContextProvider(props: { children: ReactNode }) {
  const { group } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState<NavbarInfo>(null);

  return (
    <PageContext.Provider
      value={{
        selectedGroup: group,
        setSelectedGroup(group) {
          navigate(`/user/${group}`);
        },
        info,
        setInfo,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
}

export function useGroupChat(group: string) {
  const navigate = useNavigate();

  return {
    open() {
      navigate(`/user/chat/${group}`);
    },
  };
}
