import { setCookie, getCookie } from "cookies-next";

export const setUserCookie = (userId) => {
  setCookie("user_id", userId, { maxAge: 60 * 60 * 24 * 7 });
};

export const getUserFromCookie = () => {
  const userId = getCookie("user_id");
  if (userId) {
    return userId;
  }
  return null;
};
