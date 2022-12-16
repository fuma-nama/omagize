interface ImportMeta {
  env: {
    NODE_ENV: 'development' | 'production';
    /**
     * api url
     */
    VITE_API: string;
    /**
     * gateway url
     */
    VITE_WS: string;
  };
}
