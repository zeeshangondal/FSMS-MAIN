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
    userTypeId: '',
    email:'',
}

export default function LogIn(props) {

    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' })
    const [userTypes,setUserTypes] = React.useState([])

    React.useEffect(function(){
        employeeService.getUserTypesCollectionU(setUserTypes)
    },[0])



    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length != 0 ? "" : "This field is required."

        if ('userTypeId' in fieldValues)
            temp.userTypeId = fieldValues.userTypeId.length != 0 ? "" : "User Type is required."

        if ('email' in fieldValues)
            temp.email = fieldValues.email.length != 0 ? "" : "Email is required."
        


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
        await employeeService.logInEmployee(values,valid,invalid)
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
                <h2>User Login</h2>
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Input
                            name="email"
                            label="Email"
                            value={values.email}
                            onChange={handleInputChange}
                            error={errors.email}
                        />
                        <Controls.Select
                            name="userTypeId"
                            label="User Type"
                            value={values.userTypeId}
                            onChange={handleInputChange}
                            options={userTypes}
                            error={errors.userTypeId}
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
                        <Link to='/register' style={{color:'blue' , marginTop:'70px'}}>No Account? Register here</Link>
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
