import { Link } from 'react-router-dom'
import './MainCategories.css';
import Women from "../Assest/images.jpg"
import Men from "../Assest/Mens-Fashion2020-2.jpg";
import kid from "../Assest/kidsClothing.jpg";
function MainCategories() {
    return (
        <div className='mainDiv' >

            <div className='catsubmainDiv' >
            <a href="/Products/sub/Beauty and Personal Care" style={{ textDecoration: 'none' }}>
                <h4 className="mainCatTitle">Beauty and Personal Care</h4>
                <img src="https://boldoutline.in/wp-content/uploads/2019/10/Web-Cover-82.jpg" className="mainCatImage"  alt="" />
            </a>
            </div>
            
            <div className='catsubmainDiv' >
            <a href="/Products/sub/Women's Fashion" style={{ textDecoration: 'none' }}>
                <h4 className="mainCatTitle">Women's Fashion</h4>
                <img src={`${Women}`} className="mainCatImage" alt="" />
            </a>
            </div>

            <div className='catsubmainDiv' >
            <a href="/Products/sub/Men's Fashion" style={{ textDecoration: 'none' }}>
                <h4 className="mainCatTitle">Men's Fashion</h4>
                <img src={`${Men}`} className="mainCatImage"  alt="" />
            </a>
            </div>

            <div className='catsubmainDiv'>
            <a href="/Products/sub/Kid's Fashion" style={{ textDecoration: 'none' }}>
                <h4 className="mainCatTitle">Kid's Fashion</h4>
                <img src={`${kid}`} className="mainCatImage" alt="" />
            </a>
            </div>

           
        </div>
    )
}

export default MainCategories