import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentVideo: null,
    loading: false,
    error: false,
}

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false; // false because it is ending
            state.currentVideo = action.payload;
        },
        fetchFailure: (state) => {
            state.loading = false; // false because we have results
            state.error = true;
        },
        // like and dislike just handle front-end, using mongodb to save result
        like: (state, action) => {
            // action.payload is a user id
            if (!state.currentVideo.likes.includes(action.payload)) {
                state.currentVideo.likes.push(action.payload)
                state.currentVideo.dislikes.splice(state.currentVideo.dislikes.findIndex((userId) => userId === action.payload), 1)
            }
        },
        dislike: (state, action) => {
            // action.payload is a user id
            if (!state.currentVideo.dislikes.includes(action.payload)) {
                state.currentVideo.dislikes.push(action.payload)
                state.currentVideo.likes.splice(state.currentVideo.likes.findIndex((userId) => userId === action.payload), 1)
            }
        }
    },
})

export const {fetchStart, fetchSuccess, fetchFailure, like, dislike} = videoSlice.actions
export default videoSlice.reducer