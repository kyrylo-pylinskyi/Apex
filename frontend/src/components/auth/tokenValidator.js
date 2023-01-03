import jwt_decode from "jwt-decode";

export default function validateToken(){
    if (localStorage.getItem("access_token") === null) {
        return false;
      }
      return jwt_decode(localStorage.getItem("access_token")).exp <
        Date.now() / 1000
        ? false
        : true;
}