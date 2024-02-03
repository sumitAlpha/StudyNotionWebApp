import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {
    const{totalItems, total} = useSelector((state)=>state.Cart)
  return (
    <div>
          <p>{totalItems}</p>

        {
              total > 0 ? (<div>
                <RenderCartCourses />
                <RenderTotalAmount />
                </div>) :
                (<div> Your Cart is Empty</div>)   
        } 
    </div>
  )
}

export default Cart
