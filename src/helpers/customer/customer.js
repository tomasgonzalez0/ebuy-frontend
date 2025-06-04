
import { API_BASE_URL } from '../variables';

export async function getCustomerById(Id){
    const token = localStorage.getItem('token');
    try {
    const response = await fetch(`${API_BASE_URL}Customers/GetById?IdCustomer=${Id}`,{
        method: 'GET',
           headers: {
            "Content-Type": "application/json",
            "Authorization":`${token}`
            }
    });
    const data = await response.json();
    return data;
} catch (error) {
    console.error('Error fetching customer', error);
    return [];
}
}