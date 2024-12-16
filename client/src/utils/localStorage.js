export const addUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  console.log("add user to local storage: ", user);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");

  console.log("remove user from local storage");
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem("user");

  const user = result ? JSON.parse(result) : null;

  return user;
};

export const addAdminToLocalStorage = (admin) => {
  localStorage.setItem("admin", JSON.stringify(admin));
  console.log("add admin to local storage: ", admin);
};

export const removeAdminFromLocalStorage = () => {
  localStorage.removeItem("admin");

  console.log("remove admin from local storage");
};

export const getAdminFromLocalStorage = () => {
  const result = localStorage.getItem("admin");
  console.log("Raw admin data from local storage: ", result); // {{ edit_1 }}

  const admin = result ? JSON.parse(result) : null;
  console.log("Parsed admin from local storage: ", admin); // {{ edit_2 }}

  return admin;
};
