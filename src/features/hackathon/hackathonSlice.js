import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const initialState = {
    // hackathons:{
    data: [],
    requests: [],
    loading: false,
    error: null,
    // }
};
export const fetchHackathons = createAsyncThunk(
    "hackathon/fetchHackathons",
    async (thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Hackathon`);
            if (!response.data) {
                return [];
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const fetchHackathonsAdmin = createAsyncThunk(
    "hackathon/fetchHackathonsAdmin",
    async ({ token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/hackathon`,
                { headers }
            );
            if (!response.data) {
                return [];
            }
            // console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const hackathonCreation = createAsyncThunk(
    "hackathon/hackathonCreation",
    async ({ formData, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/hackathon`,
                formData,
                { headers }
            );
            // console.log(response);
            // const response2 = await axios.get(
            //     "http://localhost:8080/Hackathon"
            // );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const hackathonEnd = createAsyncThunk(
    "hackathon/hackathonEnd",
    async ({ hackathonId, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/hackathon/end/${hackathonId}`,
                {},
                { headers }
            );
            // console.log(response);
            // const response2 = await axios.get(
            //     "http://localhost:8080/Hackathon"
            // );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const newRequest = createAsyncThunk(
    "hackathon/newRequest",
    async (formData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/ContactDetails/Contact`,
                formData
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const fetchRequests = createAsyncThunk(
    "hackathon/fetchRequests",
    async ({ token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/contactDetails`,
                { headers }
            );
            if (!response.data) {
                return [];
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const hackathonSlice = createSlice({
    name: "hackathon",
    initialState,
    reducers: {
        clearHackathons(state) {
            state.data = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHackathons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHackathons.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(fetchHackathons.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload; // Set error payload
            })
            .addCase(fetchHackathonsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHackathonsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(fetchHackathonsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload; // Set error payload
            })
            .addCase(hackathonCreation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hackathonCreation.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(hackathonCreation.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(hackathonEnd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hackathonEnd.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(hackathonEnd.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(newRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(newRequest.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(newRequest.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(fetchRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.requests = [];
                state.error = action.payload; // Set error payload
            });
    },
});

export const selectHackathons = (state) => state.hackathon.data;
export const selectHackathonById = (state, hackathonId) =>
    state.hackathon.data?.find(
        (hackathon) => hackathon.hackathonId === Number(hackathonId)
    ) || null;

export const selectRequests = (state) => state.hackathon.requests;
export const selectErrorHackathon = (state) => state.hackathon.error;
export const selectLoadingHackathon = (state) => state.hackathon.loading;

export const { clearHackathons } = hackathonSlice.actions;

export default hackathonSlice.reducer;
