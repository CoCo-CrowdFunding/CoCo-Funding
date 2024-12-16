//在api的header加入authorization 驗證token
const authHeader = (thunkAPI) => {
  return {
    headers: {
      authorization: `Bearer ${thunkAPI.getState().auth.token}`,
    },
  };
};

export default authHeader;
