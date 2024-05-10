import { SpeedDial } from "@rneui/themed";
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../constants/Colors';
import { TypeOfReactions } from "../types/reaction.type";

const speedDialActionSize = 50;

type SpeedDialActionProps = {
  iconName: TypeOfReactions,
  onPress: (reaction: TypeOfReactions) => void,
}

export default function SpeedDialAction({ iconName, onPress }: SpeedDialActionProps) {
  return (
    <SpeedDial.Action
      icon={
        <Entypo
          name={iconName}
          size={30}
          color={Colors.pickedYelllow}
        />
      }
      onPress={() => onPress(iconName)}
      color={Colors.alt}
      containerStyle={{
        shadowColor: Colors.transparent,
      }}
      buttonStyle={{
        width: speedDialActionSize,
        height: speedDialActionSize,
      }}
      iconContainerStyle={{
        padding: 5,
      }}
    />
  )
}