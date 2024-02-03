
import { catalogData } from "../apis"
import { apiConnector } from "../apiconnector"
import {toast} from "react-hot-toast"

//importing the Endpoints of CATALOG PAGE DATA
const { CATALOGPAGEDATA_API } = catalogData

export const getCatalogPageData = async (categoryId) => {
    const ToastId = toast.loading("LOADING...");
    let result = [];
    try {
        const res = await apiConnector("POST", CATALOGPAGEDATA_API, { categoryId: categoryId }); 
        if (res?.data?.success) {
            throw new Error("Could not Fetch category Page Data") 
        }
        result = res?.data;
    }
    catch (error) {
        console.log("CATALOG PAGE DATA API ERROR....", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(ToastId);
    return result;
}
