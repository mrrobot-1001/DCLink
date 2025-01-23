export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  isConnected: boolean;
  stream: string;
  session?: string;
  isadmin: boolean;
}

