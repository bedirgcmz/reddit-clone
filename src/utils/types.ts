
  export type PostDataTypes = {
    id: string;
    title: string;
    content: string;
    slug: string;
    user_id: string;
    image: string;
    created_at: string;
    updated_at: string;
  };
  export type AuthorDataTypes = {
    id: string;
    username: string;
    image: string;
  };
  export type PostWithAuthorDataTypes = PostDataTypes & {
    author: AuthorDataTypes;
  };
  export type UsersDataTypes = {
    id: string;
    fullname: string;
    username: string;
    image: string;
    role: string;
    email: string;
    password: string;
    created_at: string;
  };
  export type CommentWithAuthorDataTypes = {
    post: any;
    id: string;
    content: string;
    user_id: string;
    post_id: string;
    parent_id: string;
    created_at: string;
    updated_at: string;
    author: {
      username: string;
      image: string;
    };
  };
  
  export type FavoritesDataTypes = {
    id: string;
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

// PostWithAuthorAndSubtopicDataTypes (Post verisi + Author + Subtopic ve Topic bilgisi)
export interface PostWithAuthorAndSubtopicDataTypes extends PostWithAuthorDataTypes {
    subtopic: {
        id: string;
        name: string;
        topic: TopicsDataTypes;
    };
}
  


export type FetchContextType = {
    singlePost: PostWithAuthorDataTypes | null;
    setSinglePost: React.Dispatch<React.SetStateAction<PostWithAuthorDataTypes | null>>;
    postParamsSlug: string | null;
    setPostParamsSlug: React.Dispatch<React.SetStateAction<string | null>>;
    comments: CommentWithAuthorDataTypes[] | null;
  setComments: React.Dispatch<React.SetStateAction<CommentWithAuthorDataTypes[] | null>>;
    favorites: FavoritesDataTypes[] | null;
    setFavorites: React.Dispatch<React.SetStateAction<FavoritesDataTypes[] | null>>; 
    subtopics:SubtopicsDataTypes[] | null; 
    setSubtopics: React.Dispatch<React.SetStateAction<SubtopicsDataTypes[] | null>>; 
    topics:TopicsDataTypes[] | null; 
    setTopics: React.Dispatch<React.SetStateAction<TopicsDataTypes[] | null>>; 
    users: UsersDataTypes[] | null; 
    setUsers: React.Dispatch<React.SetStateAction<UsersDataTypes[] | null>>; 
    posts: PostDataTypes[] | null; 
    setPosts: React.Dispatch<React.SetStateAction<PostDataTypes[] | null>>; 
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>; 
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>; 
    filteredPosts: PostWithAuthorAndSubtopicDataTypes[] | null; 
    setFilteredPosts: React.Dispatch<React.SetStateAction<PostWithAuthorAndSubtopicDataTypes[] | null>>;
    getPosts: () => Promise<void>
    getComments: () => Promise<void>

    
  };
