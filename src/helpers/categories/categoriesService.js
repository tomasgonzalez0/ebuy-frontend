import { token } from "../variables";
const BASE_URL = 'http://ebuy.runasp.net/api/'

export async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}Categories/List`,{
            method: 'GET',
         
        });
        const data = await response.json();
        console.log('Fetched categories:', data);
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}