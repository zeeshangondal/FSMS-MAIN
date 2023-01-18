import {React , useEffect,useState} from 'react';
import Input from "../../components/controls/Input";
import {Form, useForm} from "../../components/useForm";
import Select from "../../components/controls/Select";
import Button from "../../components/controls/Button";
import * as service from "../../service/itemService";
import {Grid} from "@mui/material";

const initialValues = {
    id:0,
    name:'',
    category:'',
    categoryId:'',
    quantity:0,
    packaging:'',
    packagingId:'',
}

function ItemForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('quantity' in fieldValues)
            temp.quantity = fieldValues.quantity ? "" : "This field is required."
        if ('packaging' in fieldValues)
            temp.packagingId = fieldValues.packagingId.length !== 0 ? "" : "This field is required."
        if ('category' in fieldValues)
            temp.categoryId = fieldValues.categoryId.length !== 0 ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);
    const [categoryOptions,setCategoryOptions] =useState([])
    const [packagingOptions,setPackagingOptions] =useState([])
    

    useEffect(()=>{
        service.getCategoryOptionsU(setCategoryOptions)
        service.getPackagingOptionsU(setPackagingOptions)
    },[0])


    function handleSubmit(e){
        e.preventDefault();
        if(validate()){
            console.log(values);
            props.addItem(values,resetForm);
            // service.addItem(values);
        }
    }


    useEffect(() => {
        if (props.recordForEdit != null)
            setValues({
                ...props.recordForEdit
            })
    }, [props.recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
            <Input
                name="name"
                label="Name"
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}/>
            <Input
                name="quantity"
                label="Quantity"
                type="Number"
                value={values.quantity}
                onChange={handleInputChange}
                error={errors.quantity}/>
            <Select
                name="packagingId"
                label="Packaging"
                options={packagingOptions}
                value={values.packagingId}
                onChange={handleInputChange}
                error={errors.packagingId}/>
            <Select
                name="categoryId"
                label="Category"
                options={categoryOptions}
                value={values.categoryId}
                onChange={handleInputChange}
                error={errors.categoryId}/>
            <div>
                <Button
                    type="submit"
                    text="Submit"
                    onClick={handleSubmit}
                    styles={{margin:"5px"}}
                />
                <Button
                    text="Reset"
                    color="default"
                    styles={{margin:"5px"}}
                    onClick={resetForm} />
            </div>
            </Grid>
        </Form>
    );
}

export default ItemForm;