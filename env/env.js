// Dependencies
import { constants } from "buffer";
import url from "url";

// Global variables & URL handling
const env = {
  mongoURI: "mongodb://192.168.1.21:27017/mmh?retryWrites=true",
  _dirpath: new URL("..", import.meta.url),
  public: new URL("./public", import.meta.url),
};

export default env;
