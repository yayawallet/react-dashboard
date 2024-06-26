export const capitalize = (name: string) => {
  return name.toLowerCase().replace(/\b\w{1}/g, (match) => match.toUpperCase());
};
