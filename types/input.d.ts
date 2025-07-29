declare module 'input' {
  const input: {
    text: (prompt?: string) => Promise<string>;
    select: (prompt: string, choices: string[]) => Promise<string>;
    confirm: (prompt?: string) => Promise<boolean>;
    password: (prompt?: string) => Promise<string>;
  };
  
  export default input;
} 