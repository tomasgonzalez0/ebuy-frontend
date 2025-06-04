import { token } from "../variables";

const BASE_URL = 'http://ebuy.runasp.net/api/'

export async function getBrands() {
    try {
        const response = await fetch(`${BASE_URL}Brands/List`, {
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