'use client';

import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren {
  queryConfig?: QueryClientConfig;
}
export default function ReactQueryProvider({ children, queryConfig }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        ...queryConfig?.defaultOptions,
        defaultOptions: {
          ...queryConfig?.defaultOptions?.queries,
          queries: {
            staleTime: 5000,
            suspense: true
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}