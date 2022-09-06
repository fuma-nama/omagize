import {ReactNode} from "react";

export {};

declare global {
	/**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
	interface RoutesType extends IRoute {
		name: string;
		icon?: JSX.Element | string;
		hidden?: boolean;
	}

	interface DynamicRoute extends IRoute {}

	interface IRoute {
		layout: string;
		path: string;
		component: ReactNode;
		navbar?: ReactNode
	}
}
