import Styles from './Register.module.css';
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { ReactComponent as BackButton } from '../../images/goback.svg'

export default function Register() {
    const [registerStep, setRegisterStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        bornDate: '',
        phone: '',
        email: '',
        password: '',
        accept: false,
        address: '',
        cc: '',
        country: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleSubmitFirstStep(e) {
        e.preventDefault();
        if (
            formData.name &&
            formData.bornDate &&
            formData.phone &&
            formData.email &&
            formData.password &&
            formData.accept
        ) {
            setRegisterStep(2);
        }
    }

    async function handleSubmitSecondStep(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (
            formData.cc &&
            formData.country &&
            formData.city &&
            formData.address &&
            formData.bornDate &&
            formData.phone &&
            formData.email &&
            formData.password &&
            formData.accept
        ) {
            setLoading(true);
            try {
                const body = {
                    User: {
                        Email: formData.email,
                        Password: formData.password
                    },
                    Customer: {
                        Document: Number(formData.cc),
                        Name: formData.name,
                        BornDate: formData.bornDate,
                        Phone: formData.phone,
                        Address: formData.address,
                        City: formData.city,
                        Country: formData.country
                    }
                };
                const response = await fetch("http://ebuy.runasp.net/api/Customers/Register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });
                console.log(JSON.stringify(body));
                const data = await response.json();
                        console.log(data);
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Registration failed");
                }
        
                setSuccess("Registration successful! You can now log in.");
                setRegisterStep(1);
                setFormData({
                    name: '',
                    bornDate: '',
                    phone: '',
                    email: '',
                    password: '',
                    accept: false,
                    address: '',
                    cc: '',
                    country: '',
                    city: '',
                });
               } catch (err) {
                if (
                    err.message &&
                    err.message.includes("An error occurred while updating the entries")
                ) {
                    setError("A user with this document or email already exists.");
                    alert("A user with this document or email already exists.");
                } else {
                    setError(err.message || "Registration failed");
                    alert("Registration failed. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    if (registerStep === 2) {
        return (
            <section className={Styles["register"]}>
                <Form className={Styles["register-form"]} onSubmit={handleSubmitSecondStep}>
                    <NavLink to={-1} className={Styles["back-link"]}>
                        <BackButton className={Styles["back-button"]} />
                    </NavLink>
                    <div className={Styles["title"]}>
                        <h2 className={Styles["register-h2"]}>Final steps</h2>
                    </div>
                    <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicCC">
                        <Form.Label>CC</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="CC"
                            name="cc"
                            value={formData.cc}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    {error && <div className="text-danger mb-2">{error}</div>}
                    {success && <div className="text-success mb-2">{success}</div>}
                    <Button variant="primary" type="submit" id={Styles["submit-button"]} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </Button>
                    <Form.Text className={`${Styles["login-text"]} text-muted`} id={Styles["login-text"]}>
                        ¿Already have an account?
                        <NavLink to={"/login"}>
                            Login
                        </NavLink>
                    </Form.Text>
                </Form>
            </section>
        );
    }
    return (
        <section className={Styles["register"]}>
            <Form className={Styles["register-form"]} onSubmit={handleSubmitFirstStep}>
                <NavLink to={-1} className={Styles["back-link"]}>
                    <BackButton className={Styles["back-button"]} />
                </NavLink>
                <div className={Styles["title"]}>
                    <h2 className={Styles["register-h2"]}>Register</h2>
                </div>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicText">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicDate">
                    <Form.Label>Born date</Form.Label>
                    <Form.Control
                        type="date"
                        name="bornDate"
                        value={formData.bornDate}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicCheckbox">
                    <Form.Check
                        type="checkbox"
                        label="I accept the privacy policy"
                        name="accept"
                        checked={formData.accept}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                {error && <div className="text-danger mb-2">{error}</div>}
                {success && <div className="text-success mb-2">{success}</div>}
                <Button variant="primary" type="submit" id={Styles["submit-button"]}>
                    Next step
                </Button>
                <Form.Text className={`${Styles["login-text"]} text-muted`} id={Styles["login-text"]}>
                    ¿Already have an account?
                    <NavLink to={"/login"}>
                        Login
                    </NavLink>
                </Form.Text>
            </Form>
        </section>
    );
}