export interface Thread {
  id: string,
  title: string,    
  name: string;
  date: Date;
  text: string;
  posts: Post[];
  gameid: string;
}

export interface Post {
  id: string,
  name: string;
  date: Date;
  text: string;  
}