import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Typography,
    Spinner,
    Dialog,
    CardHeader,
    CardBody,
    Card,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectErrorUser,
    selectLoadingUser,
    selectUserDetails,
    ssoLogin,
    updateToken,
    userLogin,
} from "../features/user/userSlice";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
// import { showNotification } from "./Notification";
import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";
import { CLIENT_ID } from "../constants";

// const CLIENT_ID =
//     "855795644664-9q4db9e2ganku0bt3ilfdk87p5pr1gm1.apps.googleusercontent.com";

const Login = ({
    showModal,
    toggleModal,
    setShowSignInModal,
    handleToggleSignUp,
    handleToggleSignIn,
    handleToggleForgotPassword,
}) => {
    const [formData1, setFormData1] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData1((prevstate) => ({ ...prevstate, [name]: value }));
    };
    const handleForgotPasswordClick = () => {
        setShowError(false);
        setFormData1({
            email: "",
            password: "",
        });
        setValidationErrors({});
        handleToggleSignIn(false);
        handleToggleForgotPassword(true);
    };
    const handleSignUpClick = () => {
        handleToggleSignIn(false);
        handleToggleSignUp(true);
    };

    const handleGoogleSignInSuccess = async (res) => {
        try {
            await dispatch(ssoLogin(res.tokenId)).unwrap();
            // await dispatch(userLogin(formData1)).unwrap();
            const token = Cookies.get("token");
            if (token) {
                dispatch(updateToken(token));
            }
            setShowError(false);
            setValidationErrors({});
            handleToggleSignIn(false);
            navigate("/hackathons");
            toast.success("Login Successful!");
        } catch (error) {
            setShowError(true);
        }
        // sendUserDataToBackend(res.profileObj);
        //   window.location.href = "http://localhost:5173/team-dashboard/";
    };

    const handleGoogleSignInFailure = (res) => {
        const newErrors = {};
        if (res.error === "popup_closed_by_user") {
            setValidationErrors({
                ssoError: "Google login popup closed by the user.",
            });
            console.log("Google login popup closed by the user.");
            // Optionally, you can show a message to the user indicating that the login process was cancelled.
        } else {
            setValidationErrors({
                ssoError: "Login failed! Please try again..",
            });
            console.log("Login failed! res: ", res);
        }
    };

    const dispatch = useDispatch();
    const [showError, setShowError] = useState(false);
    const error = useSelector(selectErrorUser);
    const loading = useSelector(selectLoadingUser);
    const [passwordInputType, setPasswordInputType] = useState("password");

    const handleTogglePassword = (type = "none") => {
        if (type === "none") {
            if (passwordInputType === "password") {
                setPasswordInputType("text");
            }
            if (passwordInputType === "text") {
                setPasswordInputType("password");
            }
        }
        if (type === "password") {
            setPasswordInputType(type);
        }
        if (type === "text") {
            setPasswordInputType(type);
        }
    };

    // const userData = useSelector(selectUserDetails);
    const [validationErrors, setValidationErrors] = useState({});
    const handleSubmit = async (e) => {
        const newErrors = {};
        if (!formData1.email) {
            newErrors.email = "Email is Required!";
        }
        if (formData1.email && !validateEmail(formData1.email)) {
            newErrors.email = "Email is Invalid!";
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
        } else {
            try {
                e.preventDefault();
                await dispatch(userLogin(formData1)).unwrap();
                const token = Cookies.get("token");
                if (token) {
                    dispatch(updateToken(token));
                }
                setShowError(false);
                setFormData1({
                    email: "",
                    password: "",
                });
                setValidationErrors(newErrors);
                handleToggleSignIn(false);
                navigate("/hackathons");
                toast.success("Login Successful!");
            } catch (error) {
                setShowError(true);
                // toast.error("Login Failed!");
            }
        }
        setValidationErrors(newErrors);
    };

    useEffect(() => {
        setShowError(false);
    }, [showModal]);

    const validateEmail = (email) => {
        // Regex pattern for email validation
        const pattern =
            /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
        return pattern.test(email);
    };

    const navigate = useNavigate();

    const dialogHandler = () => {
        // toggleModal();
        handleToggleSignIn(false);
        handleTogglePassword("password");
        setValidationErrors({});
        setFormData1({
            email: "",
            password: "",
        });
    };

    return (
        <>
            <Dialog open={showModal} handler={dialogHandler} size={"xs"}>
                {/* <ToastContainer /> */}
                <div className="container">
                    <Card className="mx-auto max-h-[95vh] md:max-h-[89vh] w-full px-1 py-2 md:px-16 md:py-4">
                        <CardHeader
                            variant="gradient"
                            color="gray"
                            className="mb-4 grid h-28 place-items-center"
                        >
                            <Typography
                                variant="h5"
                                color="white"
                                className="text-center"
                            >
                                Sign in to your account
                            </Typography>
                        </CardHeader>
                        <CardBody className="pb-2 md:max-h-[89vh] overflow-y-auto">
                            {loading ? (
                                <div className="w-full h-72">
                                    <Spinner className="mx-auto mt-16 h-16 w-16" />
                                </div>
                            ) : (
                                <form
                                    className="account-form w-full mx-auto pt-2 md:mt-2 md:p-2 max-h-96 overflow-y-auto "
                                    onSubmit={handleSubmit}
                                >
                                    <div
                                        className={
                                            "account-form-fields mb-1 sign-in flex flex-col gap-y-4 sign-up w-full mx-auto"
                                        }
                                    >
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            label="E-mail"
                                            onChange={handleChange}
                                            value={formData1.email}
                                            placeholder="abc@gmail.com"
                                            required
                                        />
                                        {validationErrors.email && (
                                            <Typography className="text-red-500 text-xs w-fit">
                                                {validationErrors.email}
                                            </Typography>
                                        )}
                                        <Input
                                            id="password"
                                            name="password"
                                            type={passwordInputType}
                                            // type="password"
                                            label="Password"
                                            icon={
                                                passwordInputType ===
                                                "password" ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-5 h-5"
                                                        onClick={() =>
                                                            handleTogglePassword()
                                                        }
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
                                                            clipRule="evenodd"
                                                        />
                                                        <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                                                    </svg>
                                                ) : passwordInputType ===
                                                  "text" ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-5 h-5"
                                                        onClick={() =>
                                                            handleTogglePassword()
                                                        }
                                                    >
                                                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : null
                                            }
                                            onChange={handleChange}
                                            value={formData1.password}
                                            placeholder="*******"
                                            required
                                        />
                                    </div>
                                    <div
                                        style={{
                                            alignItems: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Link
                                            className=" place-self-start ml-1 mt-1 mb-2 text-sm font-bold cursor-pointer text-blue-gray"
                                            onClick={handleForgotPasswordClick}
                                        >
                                            Forgot Password?
                                        </Link>
                                        {showError && error && (
                                            <Typography className="text-red-500 text-xs w-fit">
                                                {error?.message ||
                                                    "empty error"}
                                            </Typography>
                                        )}
                                        {validationErrors.ssoError && (
                                            <Typography className="text-red-500 text-xs w-fit">
                                                {validationErrors.ssoError}
                                            </Typography>
                                        )}
                                        <Button
                                            className="btn-submit-form mb-3 cursor-pointer text-center"
                                            type="submit"
                                            size="sm"
                                            fullWidth
                                            // onClick={handleSubmit}
                                            // style={{ cursor: "pointer" }}
                                        >
                                            Sign in
                                        </Button>
                                        <GoogleLogin
                                            clientId={CLIENT_ID}
                                            buttonText="Login with Google"
                                            className="w-full flex justify-center"
                                            onSuccess={
                                                handleGoogleSignInSuccess
                                            }
                                            onFailure={
                                                handleGoogleSignInFailure
                                            }
                                            cookiePolicy={"single_host_origin"}
                                            isSignedIn={false}
                                        />
                                        <Typography
                                            variant="small"
                                            className="mt-2 flex justify-center"
                                        >
                                            Don&apos;t have an account?
                                            <Link
                                                className="ml-1 font-bold cursor-pointer text-blue-gray"
                                                onClick={handleSignUpClick}
                                            >
                                                Sign up
                                            </Link>
                                        </Typography>
                                    </div>
                                </form>
                            )}
                        </CardBody>
                        <Typography
                            variant="small"
                            color="gray"
                            className="flex items-center justify-center gap-2 font-medium opacity-60"
                        >
                            Credentials are secured
                        </Typography>
                    </Card>
                </div>
            </Dialog>
        </>
    );
};

export default Login;
