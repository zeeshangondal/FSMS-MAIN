import React, { useState, useEffect } from 'react'
import { Grid, } from '@mui/material';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import Notification from '../../components/Notification';
import * as employeeService from "../../service/employeeService";
import { Link } from 'react-router-dom';


const initialFValues = {
    id: 0,
    password: '',
    username:'',
}

export default function LogIn(props) {

    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' })


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length != 0 ? "" : "Password is required."

        if ('username' in fieldValues)
            temp.username = fieldValues.username.length != 0 ? "" : "Username is required."
        


        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const invalid = (msg='Plese fill the form correctly!') => {
        setNotify({
            isOpen: true,
            message: msg,
            type: 'error'
        })
    }
    const valid = () => {
        setNotify({
            isOpen: true,
            message: 'Logged In successfully',
            type: 'success'
        })
        window.location.href='../requisition'
    }

    const logInUser = async () => {
 //       await employeeService.logInStoreKeeper(values,valid,invalid)
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            logInUser();
        }
    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <h2>StoreKeeper Login</h2>
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Input
                            name="username"
                            label="Username"
                            value={values.username}
                            onChange={handleInputChange}
                            error={errors.username}
                        />
                        <Controls.Input
                            label="Password"
                            name="password"
                            type='password'
                            value={values.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{marginBottom:'20px'}}>
                            <Controls.Button
                                type="submit"
                                text="Log in"
                                onClick={handleSubmit} />
                            <Controls.Button
                                text="Reset"
                                color="default"
                                onClick={resetForm} /><br/>
                        </div>
                    </Grid>
                </Grid>
            </Form>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </div>
    )
}
