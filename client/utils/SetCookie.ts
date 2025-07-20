import Cookies from "universal-cookie";

const SetCookie = (value: string) => {
  const cookies = new Cookies();
  cookies.set("auth_token", value, { path: "/", maxAge: 3600 * 24 * 7 });
};

export default SetCookie;
