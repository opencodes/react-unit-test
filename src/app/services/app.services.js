import Axios from "axios";

const appServices = {
    getUsers : async ()  =>  {
        const response = await Axios.get('https://jsonplaceholder.typicode.com/users');
        if (response.data) {
            return response.data;
        }
        return [];
    }
}
export default appServices;