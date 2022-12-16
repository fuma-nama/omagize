interface ImportMeta {
  env: {
    NODE_ENV: 'development' | 'production';
    /**
     * api url
     */
    API: string;
    /**
     * gateway url
     */
    WS: string;
  };
}
