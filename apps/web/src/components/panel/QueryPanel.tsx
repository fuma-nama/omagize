import { UseQueryResult } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { ErrorPanel } from './ErrorPanel';

export function QueryStatus({
  query,
  error,
  skeleton,
  children,
}: {
  query: UseQueryResult;
  error: string;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  if (query.isError) return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return <>{skeleton}</>;
  if (query.isSuccess) return <>{children}</>;

  return <></>;
}

export function QueryStatusLayout({
  watch,
  query,
  error,
  placeholder,
  skeleton,
  children,
  container = (s) => <>{s}</>,
}: {
  watch?: any[] | null;
  query: UseQueryResult;
  error: string;
  placeholder: ReactElement;
  skeleton: ReactNode;
  children: ReactNode;
  container?: (c: ReactNode) => ReactElement;
}) {
  if (watch?.length === 0) return placeholder;
  if (query.isError) return <ErrorPanel retry={() => query.refetch()}>{error}</ErrorPanel>;
  if (query.isLoading) return container(skeleton);
  if (query.isSuccess) return container(children);

  return <></>;
}
