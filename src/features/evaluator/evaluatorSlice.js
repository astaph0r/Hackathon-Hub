import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const initialState = {
    // evaluators: {
    data: [],
    loading: false,
    error: null,
    // },
};

export const fetchEvaluators = createAsyncThunk(
    "evaluator/fetchEvaluators",
    async ({ token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/Evaluator`,
                { headers }
            );
            // console.log(response);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registerEvaluator = createAsyncThunk(
    "evaluator/registerEvaluator",
    async ({evaluatorData, token}, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/Evaluator`,
                evaluatorData,
                { headers }
            );
            // const response2 = await axios.get(
            //     "http://localhost:8080/Admin/Evaluator"
            // );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const assignEvaluator = createAsyncThunk(
    "evaluator/assignEvaluator",
    async ({evaluatorData, token}, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Admin/assign`,
                evaluatorData,
                { headers }
            );
            // const response2 = await axios.get(
            //     "http://localhost:8080/Admin/Evaluator"
            // );
            if (!response.data) {
                return [];
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const evaluatorSlice = createSlice({
    name: "evaluator",
    initialState,
    reducers: {
        clearEvaluators(state) {
            state.data = [];
            // Cookies.remove("userData");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvaluators.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvaluators.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(fetchEvaluators.rejected, (state, action) => {
                state.loading = false;
                // state.data = [];
                state.error = action.payload; // Set error payload
            })
            .addCase(registerEvaluator.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerEvaluator.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Refetch and set evalautor list
                state.error = null;
            })
            .addCase(registerEvaluator.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(assignEvaluator.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignEvaluator.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Refetch and set evalautor list
                state.error = null;
            })
            .addCase(assignEvaluator.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            });
    },
});

export const selectEvaluators = (state) => state.evaluator.data;

export const selectErrorEvaluator = (state) => state.evaluator.error;
export const selectLoadingEvaluator = (state) => state.evaluator.loading;

export const { clearEvaluators } = evaluatorSlice.actions;

export default evaluatorSlice.reducer;
