import Axios from "axios"


const BaseURL = "http://localhost:3001/api/v1/"



export const getCategoryOptionsU = async (setCategoryOptions) => {
    const response = await Axios.get(BaseURL + "itemsCategories");
    const data = response.data.data
    console.log(data)
    setCategoryOptions(data)
}
export const getPackagingOptionsU = async (setPackagingOptions) => {
    const response = await Axios.get(BaseURL + "itemsPackagings");
    const data = response.data.data
    console.log(data)
    setPackagingOptions(data)
}



export const addItem=async(itemData,valid,invalid)=>{
    try {
        const response = await Axios.post(BaseURL + "items", itemData);
        if (response.status == 201) {
            valid("Item added successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        console.log(e)
        invalid("Item is already added. Duplicate Items are not allowed");
    }
}

// export function updateItem(item) {
//     console.log("updated")
//     let itemIndex = items.findIndex(x => x.id===item.id);
//     items[itemIndex] = {...item};
//}
export const updateItem=async(itemData,valid,invalid,notify=false)=>{
    try {
        const response = await Axios.patch(BaseURL + "items/"+itemData.id, itemData);
        if (response.status == 201) {
            if(notify)
                valid("Item updated successfully")  
        }
        else
            if(notify)
                invalid(response.data.msg);
    } catch (e) {
        invalid("Item cannot be updated for now!");
    }
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// export function deleteItem(item){
//     items = items.filter(i => i.id!==item.id);
// }

export const deleteItem=async(itemData,valid,invalid)=>{
    console.log("Privded Record : ", itemData);
    try {
        const response = await Axios.delete(BaseURL + "items/"+itemData.id, itemData);
        console.log("Received Response: ", response)
        if (response.status == 201) {
            valid("Item updated successfully")
        }
        else
            invalid(response.data.msg);
    } catch (e) {
        invalid("Item cannot be updated for now!");
    }
}

// export function getItems(){
//     let category = categoryOptions;
//     let packaging = packagingOptions;
//     return items.map(x => ({
//         ...x,
//         category: category[x.categoryId ].title,
//         packaging: packaging[x.packagingId].title,
//     }))
// }

export const getItems=async(setItems)=>{
    const response = await Axios.get(BaseURL + "items");
    const data = response.data.data
    setItems(data)
}

export const getItemsOnly=async()=>{
    const response = await Axios.get(BaseURL + "items");
    const data = response.data.data
    console.log(data)
    return data;
}






























































// export let items = [
    
//     {
//         id:1,
//         name:"pen",
//         categoryId:1,
//         packagingId:1,
//         quantity:10,
        
//     },
//     {
//         id:2,
//         name:"pencils",
//         categoryId:1,
//         packagingId:1,
//         quantity:1,
//     },
//     {
//         id:3,
//         name:"plates",
//         categoryId:1,
//         packagingId:1,
//         quantity:40,
//     },
//     {
//         id:4,
//         name:"glass",
//         categoryId:0,
//         packagingId:1,
//         quantity:244,
//     },
//     {
//         id:5,
//         name:"chairs",
//         categoryId:1,
//         packagingId:0,
//         quantity:30,
//     }
// ]

// export const categoryOptions = [
//     {id: 0, title: 'Utensils'},
//     {id: 1, title: 'Stationary'}
// ];

// export const packagingOptions = [
//     {id:0, title:'box'},
//     {id:1, title:'single'},
// ]

// export function addItem(item){
//     console.log("added")
//     item.id=items.length+1;
//     items.push(item);
//     console.log(items);
// }

// export function updateItem(item) {
//     console.log("updated")
//     let itemIndex = items.findIndex(x => x.id===item.id);
//     items[itemIndex] = {...item};
// }

// export function deleteItem(item){
//     items = items.filter(i => i.id!==item.id);
// }

// export function getItems(){
//     let category = categoryOptions;
//     let packaging = packagingOptions;
//     return items.map(x => ({
//         ...x,
//         category: category[x.categoryId ].title,
//         packaging: packaging[x.packagingId].title,
//     }))
// }