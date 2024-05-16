import { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Colors from "../constants/Colors";

type PhotoPostProps = {
  imageUrl: string,
  imageStyles?: any;
}

export default function PhotoPost({ imageUrl, imageStyles }: PhotoPostProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <Image
        source={{ uri: imageUrl }}
        style={imageStyles ? imageStyles : styles.image}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading &&
        <ActivityIndicator
          size={'large'}
          color={Colors.darkBlue}
          style={{
            position: 'absolute', alignSelf: 'center', top: '45%'
          }}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    aspectRatio: 1,
  },
})