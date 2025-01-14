export const response = (res, status, message, data, error) => {
  return res
    .status(status)
    .json({ message, data: data || "", error: error || "" });
};
