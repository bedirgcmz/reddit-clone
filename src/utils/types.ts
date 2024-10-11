export type UserType = {
    name: string;
    password: string;
    favoriList: string[];
    image: string;
    id: number;
  };
  
  export type userContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
  };

  export type PostDataTypes = {
    id: string;
    title: string;
    content: string;
    slug: string;
    user_id: string;
    image: string;
    created_at: string;
  };
  
  export type UserDataTypes = {
    id: string;
    fullname: string;
    username: string;
    image: string;
    role: string;
    password: string;
    created_at: string;
  };
  export type UsersDataTypes = {
    id: string;
    fullname: string;
    username: string;
    image: string;
    role: string;
    password: string;
    created_at: string;
  };
  export type CommentsDataTypes = {
    id: string;
    content: string;
    user_id: string;
    post_id: string;
    created_at: string;
  };
  export type TopicsDataTypes = {
    id: string;
    name: string;
  };
  export type SubtopicsDataTypes = {
    id: string;
    name: string;
    topic_id: string;
    slug: string;
  };
  export type Post_SubtopicsDataTypes = {
    id: string;
    subtopic_id: string;
    post_id: string;
  };


export type FetchContextType = {
    singlePost: PostDataTypes | null;
    setSinglePost: React.Dispatch<React.SetStateAction<PostDataTypes | null>>;
    // author: UserDataTypes | null;
    // setAuthor: React.Dispatch<React.SetStateAction<UserDataTypes | null>>;
    postParamsSlug: string | null;
    setPostParamsSlug: React.Dispatch<React.SetStateAction<string | null>>;
    comments: CommentsDataTypes[] | null; 
    setComments: React.Dispatch<React.SetStateAction<CommentsDataTypes[] | null>>; 
    users: UsersDataTypes[] | null; 
    setUsers: React.Dispatch<React.SetStateAction<UsersDataTypes[] | null>>; 
    posts: PostDataTypes[] | null; 
    setPosts: React.Dispatch<React.SetStateAction<PostDataTypes[] | null>>; 
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>; 
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>; 
    filteredPosts: PostDataTypes[] | null; 
    setFilteredPosts: React.Dispatch<React.SetStateAction<PostDataTypes[] | null>>;

    
  };

//   export type SubtopicsPageFetchContextType = {
//     filteredPosts: PostDataTypes[] | null; 
//     setFilteredPosts: React.Dispatch<React.SetStateAction<PostDataTypes[] | null>>; 

//   }