import Cookies from "universal-cookie";

const RemoveCookie = () => {
  const cookies = new Cookies();
  cookies.remove("auth_token", { path: "/", maxAge: 0 });
};

export default RemoveCookie;
