export const resizeImage = (
  base64Str: string | ArrayBuffer,
  maxWidth: number,
  maxHeight: number,
  callback: (resizedBase64: string) => void
) => {
  const img = new Image();
  img.src = base64Str.toString();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, width, height);

    const resizedBase64 = canvas.toDataURL('image/jpeg');
    callback(resizedBase64);
  };
};
