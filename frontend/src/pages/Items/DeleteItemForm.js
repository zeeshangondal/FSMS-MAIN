import {React , useEffect} from 'react';
import Input from "../../components/controls/Input";
import {Form, useForm} from "../../components/useForm";
import Select from "../../components/controls/Select";
import Button from "../../components/controls/Button";
import * as service from "../../service/itemService";
import {Grid} from "@mui/material";

const initialValues = {
    quantity:0,
}

function ItemForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('quantity' in fieldValues)
            temp.quantity = fieldValues.quantity > 0  ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    function handleSubmit(e){
        e.preventDefault();
        if(validate()){
            props.deleteItem(values);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Input
                    name="quantity"
                    label="Quantity"
                    type="Number"
                    value={values.quantity}
                    onChange={handleInputChange}
                    error={errors.quantity}/>
                <Grid item xs={12}>
                    <Button
                        text="Remove"
                        color="secondary"
                        onClick={handleSubmit}
                        styles={{margin:"5px"}}
                    />
                    <Button
                        text="Cancel"
                        color="default"
                        styles={{margin:"5px"}}
                        onClick={props.cancelForm} />
                </Grid>
            </Grid>
        </Form>
    );
}

export default ItemForm;