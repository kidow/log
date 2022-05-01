
declare namespace NodeJS {
  interface Process {
    env: ProcessEnv
  }
  interface ProcessEnv {
    NODE_ENV: string
    REACT_APP_PASSWORD: string
    REACT_APP_SUPABASE_KEY: string
    REACT_APP_SUPABASE_URL: string
  }
}