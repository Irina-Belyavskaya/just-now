export const isImageUrl = (url:string) => {
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
}