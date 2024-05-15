var RNFS = require('react-native-fs');

export function deleteFile(filepath: string) {
  RNFS.exists(filepath)
    .then((result: any) => {
      console.log("file exists: ", result);

      if (result) {
        return RNFS.unlink(filepath)
          .then(() => {
            console.log('FILE DELETED');
          })
          .catch((err: { message: any; }) => {
            console.log(err.message);
          });
      }

    })
    .catch((err: { message: any; }) => {
      console.log(err.message);
    });
}