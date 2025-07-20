import Cookies from "universal-cookie";

const cookies = new Cookies();

const GetCookie = () => {
  return cookies.get("auth_token");
};

export default GetCookie;
