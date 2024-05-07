import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    recommendationData: [],
    rewriteData: "",
    loading: false,
    error: null,
};

export const botTechRecommendation = createAsyncThunk(
    "bot/botTechRecommendation",
    async ({ botData, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Bot/recommend`,
                botData,
                { headers }
            );

            const arr = JSON.parse(
                JSON.parse(response.data.message).candidates[0].content.parts[0]
                    .text
            );
            return arr;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const botRewrite = createAsyncThunk(
    "bot/botRewrite",
    async ({ botData, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Bot/rewrite`,
                botData,
                { headers }
            );

            const text = JSON.parse(response.data.message).candidates[0].content.parts[0].text

            if (text.length > 3000) {
                throw {
                    response: {
                        data: { message: "Response exceeds 3000 characters." },
                    },
                };
            }

            return text;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const botSlice = createSlice({
    name: "bot",
    initialState,
    reducers: {
        clearBotRecommendationOutput(state) {
            state.recommendationData = [];
        },
        clearBotRewriteOutput(state) {
            state.rewriteData = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(botTechRecommendation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(botTechRecommendation.fulfilled, (state, action) => {
                state.loading = false;
                state.recommendationData = action.payload;
                state.error = null;
            })
            .addCase(botTechRecommendation.rejected, (state, action) => {
                state.loading = false;
                state.recommendationData = [];
                state.error = action.payload.message;
            })
            .addCase(botRewrite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(botRewrite.fulfilled, (state, action) => {
                state.loading = false;
                state.rewriteData = action.payload;
                state.error = null;
            })
            .addCase(botRewrite.rejected, (state, action) => {
                state.loading = false;
                state.rewriteData = "";
                state.error = action.payload.message; // Set error payload
            });
    },
});

export const selectBotRecommendationOutput = (state) =>
    state.bot.recommendationData;

export const selectBotRewriteOutput = (state) => state.bot.rewriteData;

export const selectErrorBot = (state) => state.bot.error;
export const selectLoadingBot = (state) => state.bot.loading;

export const { clearBotRecommendationOutput, clearBotRewriteOutput } = botSlice.actions;

export default botSlice.reducer;
