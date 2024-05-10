import { useEffect, useState } from 'react';
import { SpeedDial } from '@rneui/themed';
import Colors from '../constants/Colors';
import SpeedDialAction from './SpeedDialAction';
import { Reaction, TypeOfReactions } from '../types/reaction.type';
import repository from '../repository';
import { useAuth } from '../context/auth-context';

type ReactionsProps = {
  postId: string,
  setReaction: React.Dispatch<React.SetStateAction<Reaction | undefined>>
}

const speedDialSize = 50;

function convertToUpperCase(input: string): string {
  const words = input.split('-');
  const capitalizedWords = words.map((word) => word.toUpperCase());
  const snakeCaseString = capitalizedWords.join('_');
  return snakeCaseString;
}

export default function Reactions({ postId, setReaction }: ReactionsProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handlePressReaction = async (reaction_type: TypeOfReactions) => {
    try {
      const body = {
        post_id: postId,
        user_id: user,
        reaction_type: convertToUpperCase(reaction_type)
      }
      const { data } = await repository.post('/reactions', body);
      setOpen(false);
      setReaction(data);
      // console.log('response: ', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setOpen(false);
    }
  }

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