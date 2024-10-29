import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import supabase from "@/lib/supabaseClient";

interface Props {
  singlePostId: string;
  currentUserId: string | undefined;
}

const FavoriteButton: React.FC<Props> = ({ singlePostId, currentUserId }) => {
  const [isFavorite, setIsFavorite] = useState<boolean| null>(null);

  useEffect(() => {
    // Favori kontrolünü sağla
    const checkFavorite = async () => {
      if (currentUserId) {
        const { data } = await supabase
          .from("favorites")
          .select("*")
          .eq("post_id", singlePostId)
          .eq("user_id", currentUserId);
        setIsFavorite(data && data.length > 0);
      }
    };
    checkFavorite();
  }, [singlePostId, currentUserId]);

  const addPostToFavoritesList = async () => {
    if (currentUserId) {
      const { data, error } = await supabase
        .from("favorites")
        .insert([{ post_id: singlePostId, user_id: currentUserId }]);
      
      if (!error) setIsFavorite(true);
    }
  };

  const deletePostFromFavoritesList = async () => {
    if (currentUserId) {
      const { data, error } = await supabase
        .from("favorites")
        .delete()
        .eq("post_id", singlePostId)
        .eq("user_id", currentUserId);
      
      if (!error) setIsFavorite(false);
    }
  };

  return isFavorite ? (
    <FaHeart
      className="cursor-pointer text-orange"
      onClick={deletePostFromFavoritesList}
    />
  ) : (
    <FaRegHeart
      className="cursor-pointer"
      onClick={addPostToFavoritesList}
    />
  );
};

export default FavoriteButton;
