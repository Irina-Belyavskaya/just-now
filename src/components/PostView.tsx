import { FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity, Image, Text, Pressable } from "react-native";
import { Post } from "../types/post.type";
import VideoPost from "./VideoPost";
import { useState } from "react";
import Colors from "../constants/Colors";
import repository from "../repository";

type PostProps = {
  post: Post
}

export default function PostView ({post}: PostProps) {
  const [like, setLike] = useState<boolean>();

  const isImageUrl = (url:string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  const likePost = async (postLikes: number, postId: string) => {
    try {
      console.log(postLikes)
      const dto = {
        likes: postLikes + 1
      }
      await repository.post(`/posts/set-reaction/${postId}`, dto);
    } catch (error) {
      console.error(error);
    }
  }

  const dislikePost = async (postLikes: number, postId: string) => {
    try {
      console.log(postLikes)

      await repository.post(`/posts/set-reaction/${postId}`, {likes: postLikes - 1});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View 
      style={{
        margin: 10, borderRadius: 7, elevation: 5, backgroundColor: "black", shadowColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10, }}>
        <Image 
          source={{uri: post.user.user_profile_picture_url}} 
          style={{ height: 50, width: 50, borderRadius: 50 }} 
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>{'Name'}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 12, color: 'white' }}>
              {new Date(post.post_created_at).toString().substring(0, 16)}
            </Text>
            <Text style={{ fontSize: 12, marginLeft: 5, color: 'white' }}>
              {new Date(post.post_created_at).getHours() + " : " + new Date(post.post_created_at).getMinutes()}
            </Text>
          </View>
        </View>
      </View>
      {
        isImageUrl(post.post_content_url)
        ? <Image 
            source={{ uri: post.post_content_url }} 
            style={{ height: 454, resizeMode: 'contain' }}
          />
        :
          <VideoPost post={post}/>
      }
      <View style={{ height: 1, width: "100%", backgroundColor: "white" }} />
      <View style={{ flexDirection: "row", }}>
        <View 
          style={{ 
            flex: 1, 
            margin: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text 
            style={{ 
              textAlign: "center", 
              fontWeight: "bold", 
              color: 'white', 
              marginRight: 10 
            }}
          >
            {post.likes} 
          </Text>
          
            {
            like 
              ? 
              <FontAwesome 
                name="heart" 
                size={24} 
                color={Colors.pickedYelllow}
                onPress={() => {
                  if (like) { 
                    setLike(false);
                    dislikePost(post.likes, post.post_id)
                  }
                }}                
              /> 
              : 
              <Pressable 
                onPress={() => {
                  if (!like) {
                    setLike(true);
                    likePost(post.likes, post.post_id);
                  }
                }}
              >
                <FontAwesome 
                  name="heart-o" 
                  size={24} 
                  color={Colors.pickedYelllow}
                />
              </Pressable>         
            }       
        </View>
        <View style={{ backgroundColor: "white", height: "100%", width: 1 }} />
        <TouchableOpacity style={{ flex: 1, margin: 10 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", color: 'white' }}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}