import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null)
    
    const getEnrolledCourses = async () =>{
        try {
            const response = getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        }
        catch (error) {
            console.log("Unable to Fetch Enrolled Courses");
        }
    }

    useEffect(() => {
     getEnrolledCourses();
    },[]);
    
  return (
    <div className='text-white gap-3 '>
        <div>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div>Loading...</div>)
                  :
            !enrolledCourses.length ? (<p>You have not Enrolled to any Course</p>)
                      : (
                          <div>
                             <div className='flex gap-4'>
                                  <p>Course Name</p> 
                                  <p>Duration</p>
                                  <p>Progress</p> 
                                </div>   
                              {/* Cards shure hote h ab */}
                              {
                                  enrolledCourses.map((course, index) => (
                                      <div key={index}>
                                          <div>
                                              <img src={course.thumbnail} /> 
                                              <div>
                                                 <p>{course.courseName}</p>
                                                  <p>{course.courseDescription}</p>
                                               </div>
                                          </div>
                                          
                                          <div>
                                            {course?.totalDuration}  
                                          </div> 

                                          <div>
                                              <p>Progress: {course.progressPercentage || 0}%</p>
                                              <ProgressBar
                                                 completed={course.progressPercentage || 0}
                                                 height='8px'
                                                 isLabelVisible={false}
                                                />
                                          </div>
                                     </div>
                                 ))
                              }
                           </div>
             )
                 
        } 
    </div>
  )
}

export default EnrolledCourses

