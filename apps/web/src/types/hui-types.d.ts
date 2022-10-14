export {};

declare global {
  interface SidebarItem {
    name: string;
    icon?: JSX.Element | string;
    path: string;
  }
}
