
const BASE_URL = 'https://ebuy.runasp.net/api/'

export async function getSuppliers() {
        const token = localStorage.getItem('token');
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