export const moveToRight = (from: number, to: number) => {
  return {
    from: {
      translateX: from,
    },
    to: {
      translateX: to,
    },
  };
};
