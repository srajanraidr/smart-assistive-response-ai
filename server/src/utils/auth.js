export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => getRole() === "ADMIN";

export const isDispatcher = () =>
  getRole() === "DISPATCHER";

export const isOperator = () =>
  getRole() === "OPERATOR";