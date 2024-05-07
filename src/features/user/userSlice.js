import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const initialState = {
    data: null,
    token: "",
    loading: false,
    error: null,

    // register: {
    //     data: null,
    //     loading: false,
    //     error: null,
    // },
    // login: {
    //     data: null,
    //     loading: false,
    //     error: null,
    // },
};

export const userRegistration = createAsyncThunk(
    "user/userRegistration",
    async (formData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/register`,
                formData
            );
            return response.data;
            // return { data: response.data, status: response.status };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const otpVerification = createAsyncThunk(
    "user/otpVerification",
    async (otpDetails, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/verifyOtp`,
                otpDetails
            );
            let jwt = "";
            if (response.data?.userId && response.headers.hasAuthorization()) {
                jwt = response.headers.getAuthorization().split(" ")[1];
                Cookies.set("token", jwt, {
                    expires: 7,
                });

                Cookies.set("userId", response.data.userId, {
                    expires: 7,
                });
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const userLogin = createAsyncThunk(
    "user/userLogin",
    async (formData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/login`,
                formData
            );
            let jwt = "";
            if (response.data?.userId && response.headers.hasAuthorization()) {
                jwt = response.headers.getAuthorization().split(" ")[1];
                Cookies.set("token", jwt, {
                    expires: 7,
                });

                Cookies.set("userId", response.data.userId, {
                    expires: 7,
                });
            }
            return response.data;
            // return { data: response.data, status: response.status };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const ssoLogin = createAsyncThunk(
    "user/ssoLogin",
    async (idtoken, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/ssoLogin`,
                { idtoken }
            );
            let jwt = "";
            if (response.data?.userId && response.headers.hasAuthorization()) {
                jwt = response.headers.getAuthorization().split(" ")[1];
                Cookies.set("token", jwt, {
                    expires: 7,
                });

                Cookies.set("userId", response.data.userId, {
                    expires: 7,
                });
            }
            return response.data;
            // return { data: response.data, status: response.status };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const ssoRegister = createAsyncThunk(
    "user/ssoRegister",
    async (idtoken, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/ssoRegister`,
                { idtoken }
            );
            let jwt = "";
            if (response.data?.userId && response.headers.hasAuthorization()) {
                jwt = response.headers.getAuthorization().split(" ")[1];
                Cookies.set("token", jwt, {
                    expires: 7,
                });

                Cookies.set("userId", response.data.userId, {
                    expires: 7,
                });
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const reattemptLogin = createAsyncThunk(
    "user/reattemptLogin",
    async ({ userId, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/${userId}`,
                { headers }
                // otpDetails
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (Email, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/forgotPassword`,
                Email
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async (formData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/changePassword`,
                formData
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout(state) {
            state.data = null;
            state.token = "";
            // Cookies.remove("userData");
        },
        updateToken(state, action) {
            state.token = action.payload;
        },
        // reattemptLogin(state, action) {
        //     // const userCookie = Cookies.get("userData");
        //     // if (userCookie) {
        //     state.data = action.payload;
        //     console.log("reloggedin");
        //     // console.log({ data: JSON.parse(userCookie) });
        //     // }
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;

                // state.register.loading = true;
                // state.register.error = null;
            })
            .addCase(userRegistration.fulfilled, (state, action) => {
                // state.data = action.payload;
                state.loading = false;
                state.error = null;

                // state.register.loading = false;
                // state.register.data = action.payload; // Extract data from the response
                // state.register.error = null;
            })
            .addCase(userRegistration.rejected, (state, action) => {
                // state.data = null;
                state.loading = false;
                state.error = action.payload;

                // state.register.loading = false;
                // state.register.data = null;
                // state.register.error = action.payload; // Set error payload
            })
            .addCase(otpVerification.pending, (state) => {
                state.loading = true;
                state.error = null;

                // state.register.loading = true;
                // state.register.error = null;
            })
            .addCase(otpVerification.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;

                // state.register.loading = false;
                // state.register.data = action.payload; // Extract data from the response
                // state.register.error = null;
            })
            .addCase(otpVerification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error payload
            })
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ssoLogin.pending, (state) => {
                // state.data = null;
                state.loading = true;
                state.error = null;
            })
            .addCase(ssoLogin.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(ssoLogin.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ssoRegister.pending, (state) => {
                // state.data = null;
                state.loading = true;
                state.error = null;
            })
            .addCase(ssoRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(ssoRegister.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(reattemptLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reattemptLogin.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(reattemptLogin.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectUserDetails = (state) => state.user.data;
export const selectUserToken = (state) => state.user.token;
export const selectUserId = (state) => state.user.data?.userId;
export const selectErrorUser = (state) => state.user.error;
export const selectLoadingUser = (state) => state.user.loading;

export const {
    logout,
    updateToken,
    // reattemptLogin,
    // successTeamRegistration,
} = userSlice.actions;
export default userSlice.reducer;
