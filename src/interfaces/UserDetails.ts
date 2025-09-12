export interface SetTokensArgs{
    accessToken: string;
}

export interface AuthContextData {
    
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: ()=> void; 
    isLoading: boolean;
    register(username:string, password:string, email: string) : Promise<void>
    user: User | null
}

export interface User {
  id: string;
  username: string;
  email: string;
}