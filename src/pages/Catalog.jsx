import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import  CourseSlider  from '../components/core/Catalog/CourseSlider';
import  Course_Card  from '../components/core/Catalog/Course_Card';

export const Catalog = () => {
    const { catalogName } = useParams();
    const [catalogPageDetails, setCatalogPageDetails] = useState(null);
    const [categoryId, setCategoryId] = useState("");

   //Fetech all categories 
    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
            setCategoryId(category_id);
        }
        getCategories();
    }, [catalogName])
    
    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                const response = await getCatalogPageData(categoryId);
                console.log("printing res", response);
                setCatalogPageDetails(response);
            } catch (error) {
                console.log(error) 
            }
        } 
        if(categoryId) {
            getCategoryDetails();
        }
    },[categoryId])
  return (
    <div className='text-white'>
        <div>
              <p>{`home/catalog/`}
                  <span>{ catalogPageDetails?.data?.selectedCategory?.name}</span>   
              </p> 
              <p> { catalogPageDetails?.data?.selectedCategory?.name}</p>
              <p>{ catalogPageDetails?.data?.selectedCategory?.description}</p>   
        </div>   
        <div>
            {/* section-1   */}
            <div>
                  <div className='flex gap-x-3'>
                  <div>Courses to get you started</div>
                  <p>Most Popular</p>
                  <p> New</p>    
                </div>  
                <div>
                      <CourseSlider courses={catalogPageDetails?.data?.selectedCategory?.courses} />    
                </div>  
            </div>
            {/* {Section-2}  */}
              <div>
                  <div>Top courses in{catalogPageDetails?.data?.selectedCategory?.name }</div>
                <p>Top Courses</p> 
                <div>
                 <CourseSlider Courses={catalogPageDetails?.data?.differentCategory?.courses}/>   
                </div>  
            </div>
            {/* section-3    */}
            <div>
                  <p>Frequently Bought</p> 
                  <div className='py-8'>
                     <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                              catalogPageDetails?.data?.mostSellingCourses?.slice(0, 4).map((course, index) => (
                            <Course_Card course ={course} key={index} Height={"h-[400]"} />
                        ))      
                       }   
                     </div>
                </div>     
            </div>  
        </div> 
        <Footer/> 
    </div>
  )
}

