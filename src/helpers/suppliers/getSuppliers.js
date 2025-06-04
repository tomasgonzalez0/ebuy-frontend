import { token } from "../variables";
const BASE_URL = 'http://ebuy.runasp.net/api/'

export async function getSuppliers() {
    try {
        const response = await fetch(`${BASE_URL}Suppliers/List`,{
            method: 'GET',
              headers: {
            "Content-Type": "application/json",
            "Authorization":`${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}