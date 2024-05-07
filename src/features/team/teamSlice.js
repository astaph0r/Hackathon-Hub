import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const initialState = {
    data: [],
    loading: false,
    error: null,
};
export const teamRegistration = createAsyncThunk(
    "team/teamRegistration",
    async ({ hackathonId, userId, team, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Team/${hackathonId}/${userId}`,
                team,
                { headers }
            );
            console.log(team);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const ideaSubmission = createAsyncThunk(
    "team/ideaSubmission",
    async ({ hackathonId, userId, ideaData, token }, thunkAPI) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Team/idea/${hackathonId}/${userId}`,
                ideaData,
                { headers }
            );
            return response.data;
        } catch (error) {
            // console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const repoSubmission = createAsyncThunk(
    "team/repoSubmission",
    async ({ hackathonId, userId, repoData, token }, thunkAPI) => {
        try {
            // console.log({ hackathonId, userId, repoData });
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Team/ideaFiles/${hackathonId}/${userId}`,
                repoData,
                { headers }
            );
            // console.log(response)
            return response.data;
        } catch (error) {
            // console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const fetchTeamDetails = createAsyncThunk(
    "hackathon/fetchTeamDetails",
    async ({userId, token}, thunkAPI) => {
        try {
            // console.log(userId);
            // if (userId) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/User/Teams/${userId}`,
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

export const fetchJudgeTeamsByHackathonId = createAsyncThunk(
    "team/fetchJudgeTeamsByHackathonId",
    async ({ hackathonId, token }, thunkAPI) => {
        // Assuming hackathonId is already available in the state
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Judge/selectedTeams/${hackathonId}`,
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

export const fetchPanelistTeamsByHackathonId = createAsyncThunk(
    "team/fetchPanelistTeamsByHackathonId",
    async ({ hackathonId, panelistid, token }, thunkAPI) => {
        // Assuming hackathonId is already available in the state
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            // console.log(token)
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/panelist/${hackathonId}/${panelistid}`,
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

export const rejectTeam = createAsyncThunk(
    "team/rejectTeam",
    async ({ teamId, token }, thunkAPI) => {
        // Assuming hackathonId is already available in the state
        try {
            // console.log(teamId)
            // if (hackathonId !== -1 && panelistid && teamId) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Team/rejected/${teamId}`, {},
                { headers }
            );
            // const response2 = await axios.get(
            //     `http://localhost:8080/panelist/${hackathonId}/${panelistid}`
            // );
            return response.data;
            // }
            // return [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const acceptTeam = createAsyncThunk(
    "team/acceptTeam",
    async ({ teamId, token }, thunkAPI) => {
        // Assuming hackathonId is already available in the state
        try {
            // if (hackathonId !== -1 && panelistid && teamId) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Team/selected/${teamId}`, {},
                { headers }
            );
            // const response2 = await axios.get(
            //     `http://localhost:8080/panelist/${hackathonId}/${panelistid}`
            // );
            return response.data;
            // }
            // return [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const rateTeam = createAsyncThunk(
    "team/rateTeam",
    async ({ teamId, rating, feedback, userId, token }, thunkAPI) => {
        // Assuming hackathonId is already available in the state
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/Judge/review/${teamId}`,
                { rating, feedback, userId },
                { headers }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        clearTeams(state) {
            state.data = [];
            // Cookies.remove("userData");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(teamRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(teamRegistration.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(teamRegistration.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(ideaSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ideaSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload.; // Extract data from the response
                state.error = null;
            })
            .addCase(ideaSubmission.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(repoSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(repoSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // state.repo.data = action.payload; // Extract data from the response
                // state.teamdetails.data = action.payload;
                state.error = null;
            })
            .addCase(repoSubmission.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(fetchTeamDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Extract data from the response
                state.error = null;
            })
            .addCase(fetchTeamDetails.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload; // Set error payload
            })
            .addCase(fetchJudgeTeamsByHackathonId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchJudgeTeamsByHackathonId.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.data = action.payload;
                    state.error = null;
                }
            )
            .addCase(fetchJudgeTeamsByHackathonId.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload;
            })
            .addCase(fetchPanelistTeamsByHackathonId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchPanelistTeamsByHackathonId.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.data = action.payload;
                    state.error = null;
                }
            )
            .addCase(
                fetchPanelistTeamsByHackathonId.rejected,
                (state, action) => {
                    state.loading = false;
                    // state.data = null;
                    state.error = action.payload;
                }
            )

            .addCase(acceptTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptTeam.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload;
                // state.panelistteams.data = action.payload;
                state.error = null;
            })
            .addCase(acceptTeam.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload;
            })
            .addCase(rejectTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectTeam.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload;
                state.error = null;
            })
            .addCase(rejectTeam.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload;
            })
            .addCase(rateTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rateTeam.fulfilled, (state, action) => {
                state.loading = false;
                // state.data= action.payload;
                state.error = null;
            })
            .addCase(rateTeam.rejected, (state, action) => {
                state.loading = false;
                // state.data = null;
                state.error = action.payload;
            });
    },
});

export const selectTeams = (state) => state.team.data;
export const selectTeamByHackathonId = (state, hackathonId) =>
    state.team.data?.find((team) => team.hackathonId === Number(hackathonId)) ||
    null;
export const selectErrorTeam = (state) => state.team.error;
export const selectLoadingTeam = (state) => state.team.loading;

export const { clearTeams } = teamSlice.actions;

export default teamSlice.reducer;
