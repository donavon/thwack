const sortByEntry = ([a], [b]) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export default sortByEntry;
