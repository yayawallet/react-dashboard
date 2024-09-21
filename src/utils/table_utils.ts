export const capitalize = (name: string) => {
  return name.toLowerCase().replace(/\b\w{1}/g, (match) => match.toUpperCase());
};

export const formatDate = (timestamp: Date) => {
  if (!timestamp) return;

  const stringTime = timestamp.toString();

  //stringTime.length === 10 -> Unix timestamp
  const dateObj =
    stringTime.length === 10 ? new Date(Number(timestamp) * 1000) : new Date(timestamp);

  const date = dateObj.toDateString().replace(/^\w+\s/, '');
  const time = dateObj.toLocaleTimeString();

  return `${date} - ${time}`;
};
