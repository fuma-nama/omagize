import {ReactNode} from "react";

export {};

declare global {
	/**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
	interface RoutesType {
		name: string;
		layout: string;
		component: ReactNode;
		icon: JSX.Element | string;
		path: string;
		secondary?: boolean;
	}
}
