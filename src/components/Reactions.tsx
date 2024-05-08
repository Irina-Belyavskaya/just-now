import { useState } from 'react';
import { SpeedDial } from '@rneui/themed';
import Colors from '../constants/Colors';
import SpeedDialAction from './SpeedDialAction';
import { TypeOfReactions } from '../types/reaction.type';

const speedDialSize = 50;

export default function Reactions() {
  const handlePressReaction = (reaction: TypeOfReactions) => {
    console.log(reaction)
  }

  const [open, setOpen] = useState(false);
  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: 'add-reaction', color: Colors.pickedYelllow, size: 40 }}
      openIcon={{ name: 'close', color: Colors.pickedYelllow, size: 40 }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      color={Colors.alt}
      containerStyle={{
        shadowColor: Colors.transparent,
      }}
      buttonStyle={{
        width: speedDialSize,
        height: speedDialSize,
        marginRight: 7,
        borderRadius: 100
      }}
      iconContainerStyle={{
        width: speedDialSize,
        height: speedDialSize,
        padding: 5,
      }}
    >
      <SpeedDialAction
        iconName={TypeOfReactions.EMOJI_FLIRT}
        onPress={handlePressReaction}
      />
      <SpeedDialAction
        iconName={TypeOfReactions.EMOJI_HAPPY}
        onPress={handlePressReaction}
      />
      <SpeedDialAction
        iconName={TypeOfReactions.EMOJI_NEUTRAL}
        onPress={handlePressReaction}
      />
      <SpeedDialAction
        iconName={TypeOfReactions.EMOJI_SAD}
        onPress={handlePressReaction}
      />
    </SpeedDial>
  );
}