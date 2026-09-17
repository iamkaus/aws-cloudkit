export const handler = async (event) => {
  return {
    success: true,
    version: 1,
    event,
  };
};
