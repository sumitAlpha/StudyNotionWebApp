import { createSlice } from "@reduxjs/toolkit";
const initalState = {
    courseSectionData:[],
    courseEntireData:[],
    completedLectures :[],
    totalNoOfLectures:0,
}

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initalState,
    reducers: {
        setCourseSectionData: (state, action) => {
         state.courseSectionData = action.payload 
        },
        setCourseEntireData: (state, action) => {
            state.courseEntireData = action.payload
        },
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload
        },
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload
        },
        updateCompletedLectures: (state, action) => {
            state.completedLectures = [...state.completedLectures, action.payload]
        },
    }
})

export const {
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    setCompletedLectures,
    updateCompletedLectures,
} = viewCourseSlice.actions
  
export default viewCourseSlice.reducer