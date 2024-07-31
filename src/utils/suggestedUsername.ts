import { authAxios } from '../api/axios';

const generateRandomNumber = (digit: number) => {
  if (!digit || digit > 12) return 0;

  let num = 0;

  for (let i = 0; i < digit; i++) {
    num = num * 10 + Math.ceil(Math.random() * 5);
  }

  return num;
};

const isUsernameAvailable = async (username: string) => {
  let isAvailable;

  await authAxios
    .post('/user/search', { query: username })
    .then((res) => (isAvailable = res.data?.length === 0))
    .catch(() => (isAvailable = false));

  return isAvailable;
};

export const suggestedUsername = async (fullname: string) => {
  let suggestedUsername = '';

  let normalizedName = fullname.toLowerCase().trim().split(' ').join('').substring(0, 12);

  if (normalizedName.length < 12) {
    const characterLeft = 12 - normalizedName.length;
    const randomNum = generateRandomNumber(characterLeft);

    normalizedName = normalizedName.concat(String(randomNum));
  }

  let isAvailable = await isUsernameAvailable(normalizedName);
  if (isAvailable) return normalizedName;

  let digit = 2;
  const prevGeneratedNums: number[] = [];

  console.log(isAvailable);

  while (!isAvailable) {
    if (digit > 12) break;

    let randomNum = generateRandomNumber(digit);

    while (prevGeneratedNums.includes(randomNum)) {
      randomNum = generateRandomNumber(digit);
    }

    prevGeneratedNums.push(randomNum);

    suggestedUsername = normalizedName.slice(0, 12 - digit).concat(String(randomNum));
    isAvailable = await isUsernameAvailable(suggestedUsername);

    digit++;
  }

  return suggestedUsername;
};
