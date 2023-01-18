import React, { useState, useEffect } from 'react'
import { Grid, } from '@mui/material';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import Notification from '../../components/Notification';
import * as employeeService from "../../service/employeeService";
import { Link } from 'react-router-dom';


const initialFValues = {
    id: 0,
    username: '',
    designation: '',
    departmentId: '',
    password: '',
    confirmPassword: '',
    userTypeId: '',
    email:'',
    phoneNumber:''
}

export default function Register(props) {

    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' })


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('username' in fieldValues)
            temp.username = fieldValues.username ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length != 0 ? "" : "This field is required."

        if ('confirmPassword' in fieldValues) {
            temp.confirmPassword = fieldValues.confirmPassword.length != 0 ? (values.password == fieldValues.confirmPassword ? "" : "Password doesn't match") : "This field is required."

        }
        if ('designation' in fieldValues)
            temp.designation = fieldValues.designation ? "" : "Designation is required."
        if ('departmentId' in fieldValues)
            temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "Department is required."
        if ('userTypeId' in fieldValues)
            temp.userTypeId = fieldValues.userTypeId.length != 0 ? "" : "User Type is required."

        if ('email' in fieldValues)
            temp.email = fieldValues.email.length != 0 ? "" : "Email is required."

        
        if ('phoneNumber' in fieldValues)
            temp.phoneNumber = fieldValues.phoneNumber.length != 0 ? "" : "Phone Number is required."

        


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
            message: 'Registered successfully',
            type: 'success'
        })

        window.location.href='../login'
    }

    const registerUser = async () => {
        await employeeService.insertEmployee(values,valid,invalid)
    }
    const handleSubmit = e => {
        e.preventDefault()
        console.log(values)
        if (validate()) {
            console.log("Valid")
            registerUser();
        }

    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
            <h2>Register User</h2>
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
                            name="designation"
                            label="Designation"
                            value={values.designation}
                            onChange={handleInputChange}
                            error={errors.designation}
                        />
                        <Controls.Input
                            name="email"
                            label="Email"
                            value={values.email}
                            onChange={handleInputChange}
                            error={errors.email}
                        />
                        <Controls.Input
                            name="phoneNumber"
                            label="Phone Number"
                            value={values.phoneNumber}
                            onChange={handleInputChange}
                            error={errors.phoneNumber}
                        />
                        <Controls.Input
                            label="Password"
                            name="password"
                            type='password'
                            value={values.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                        <Controls.Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type='password'
                            value={values.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                        />

                        <Controls.Select
                            name="departmentId"
                            label="Department"
                            value={values.departmentId}
                            onChange={handleInputChange}
                            options={employeeService.getDepartmentCollection()}
                            error={errors.departmentId}
                        />
                        <Controls.Select
                            name="userTypeId"
                            label="User Type"
                            value={values.userTypeId}
                            onChange={handleInputChange}
                            options={employeeService.getUserTypes()}
                            error={errors.userTypeId}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <div style={{marginBottom:'20px'}}>
                            <Controls.Button
                                type="submit"
                                onClick={handleSubmit}
                                text="Register" />
                            <Controls.Button
                                text="Reset"
                                color="default"
                                onClick={resetForm} />
                        </div>
                        <Link to='/login' style={{color:'blue' , marginTop:'70px'}}>Already have account? LogIn here</Link>
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
