
const API_BASE_URL = 'https://ebuy.runasp.net/api/Products';

export async function getProducts() {
        const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://ebuy.runasp.net/api/products/List',{
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

export async function getProductImages(productId) {
        const token = localStorage.getItem('token');
    try {
        const url = `https://ebuy.runasp.net/api/UploadFiles/GetImagesByProductId?IdProduct=${productId}`;
        const response = await fetch(url,{
            method: 'GET',
         
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product images:', error);
        return [];
    }
}

export async function getProductById(id) {
        const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/Search?id=${id}`,{
        method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization":`${token}`
            }
    });
    const data = await response.json();
    return data;
}

export async function switchStatusProduct(id) {
        const token = localStorage.getItem('token');
    try {
        const url = `https://ebuy.runasp.net/api/OnlineListings/ActivateAndDeactivate?IdOnlineListing=${id}`;
        const response = await fetch(url, {
            method: 'PUT',
             headers: {
            "Content-Type": "application/json",
            "Authorization":`${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error switching product status:', error);
        return null;
    }
}

export async function getProductsByBranch(branchName) {
        const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/ListByBranchName?branchName=${branchName}`,{
            method: 'GET',
                headers: {
            "Content-Type": "application/json",
            "Authorization":`${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products by branch:', error);
        return [];
    }
}

export async function getImagesByProductName(productName){
        const token = localStorage.getItem('token');
    const data = await getProducts();
    const product = data.find(p => p.Name === productName);
    if (product) {
        return getProductImages(product.Id);
    } else {
        console.error('Product not found:', productName);
        return [];
    }
}
