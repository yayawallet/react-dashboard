export const capitalize = (name: string) => {
  return name.toLowerCase().replace(/\b\w{1}/g, (match) => match.toUpperCase());
};

export const dateFormatter = (timestamp: Date) => {
  const dateObj = new Date(Number(timestamp) * 1000);

  const date = dateObj.toDateString().replace(/^\w+\s/, '');
  const time = dateObj.toLocaleTimeString();

  return `${date} - ${time}`;
};
