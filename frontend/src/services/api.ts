
import axios from "axios";
const api = axios.create({
  baseURL: "https://heitorppaiva.pythonanywhere.com/",
});
export default api;