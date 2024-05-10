export enum TypeOfReactions {
  EMOJI_FLIRT = 'emoji-flirt',
  EMOJI_HAPPY = 'emoji-happy',
  EMOJI_NEUTRAL = 'emoji-neutral',
  EMOJI_SAD = 'emoji-sad'
}

export type Reaction = {
  post_id: string,
  user_id: string,
  reaction_type: TypeOfReactions,
  reaction_created_at: string,
  reaction_updated_at: string
}
