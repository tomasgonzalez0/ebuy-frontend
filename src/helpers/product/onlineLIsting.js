import { token } from "../variables";
const API_BASE_URL = 'http://ebuy.runasp.net/api/OnlineListings/';

export async function getOnlineListing() {
    try {
        const response = await fetch(`${API_BASE_URL}List`,{
            method: 'GET',
     
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getPublisherName(id) {
        try {
        const response = await fetch(`${API_BASE_URL}GetOnlineListingPublisherName?idOnlineListing=${id}`,{
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

export async function getListingBySupplier(id){
    try {
        const response = await fetch(`http://ebuy.runasp.net/api/OnlineListingBySuppliers/List?IdSupplier=${id}`,{
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

export async function getListingByOwn(){
    try {
        const response = await fetch(`http://ebuy.runasp.net/api/OnlineListingOwns/List`,{
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

