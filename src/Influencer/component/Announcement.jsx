import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./announcement.css"

const Announcement = () => {
  const navigate = useNavigate();

  function handleChange(value) {
    navigate(`/Influencer/Products/${value}`);
  }
  return (
    <div className='Container'>
      <div className='Electronics'>
        <select onChange={event => handleChange(event.target.value)}>
          <option value="Electronics">Electronics</option>
          <option value="Mobile and laptop">Mobile & laptop</option>
          <option value="Computer and PC Part">Computer & PC Part</option>
          <option value="Phone and Tablet Accessories">Phone & Tablet Accessories</option>
          <option value="TV and Video Accessories">TV and Video Accessories</option>
          <option value="Video Games and Consoles">Video Games & Consoles</option>
          <option value="Large Appliances">Large Appliances</option>
          <option value="Drones and 3D Printed Products">Drones & 3D Printed Products</option>
          <option value="Lighting Bulbs">Lighting Bulbs</option>
          <option value="Generators and Power Suppliers">Generators & Power Suppliers</option>
          <option value="Camera and Accessories">Camera & Accessories</option>
          <option value="Audio device">Audio device</option>
          <option value="Home storage supplies">Home storage supplies</option>
        </select>
      </div>

      <div className='Beauty and Personal Care'>
        <select onChange={event => handleChange(event.target.value)}>
          <option value="Beauty and Personal Care">Beauty & Personal Care</option>
          
        </select>
      </div>

        <div className='Clothing'>
          <select onChange={event => handleChange(event.target.value)}>
            <option value="Clothing">Clothing</option>
            <option value="Women's Fashion">Women's Fashion</option>
            <option value="Men's Fashion">Men's Fashion</option>
          </select>
        </div>

        <div className='Shoes'>
          <select onChange={event => handleChange(event.target.value)}>
            <option value="Shoes">Shoes</option>
            <option value="Men's Shoes">Men's Shoes</option>
            <option value="Kid's Shoes">Kid's Shoes</option>
            <option value="Women's Shoes">Women's Shoes</option>
          </select>
        </div>

      
    </div>
  )
}

export default Announcement
