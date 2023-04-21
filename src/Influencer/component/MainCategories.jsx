import { Link } from 'react-router-dom'
import './MainCategories.css'
function MainCategories() {
    return (
        <div className='mainDiv' >
                <div className='submainDiv' >
            <Link to="/Influencer/Products/Electronic" style={{ textDecoration: 'none' }}>
                    <h4 style={{ justifyContent: 'center', color: 'black', fontWeight: '600', display: 'flex' }}>Electronic</h4>
                    <img src="https://www.pny.com.tw/en/upload/ad_list/en_ad_list_19a22_9fb7rww3zw.png" style={{ width: '100%' , borderRadius:'1px' , height:'220px' }} alt="" />
            </Link>
                </div>

            <div className='submainDiv' >
            <Link to="/Influencer/Products/beauty" style={{ textDecoration: 'none' }}>
                <h4 style={{ justifyContent: 'center', color: 'black', fontWeight: '600', display: 'flex' }}>Beauty Product</h4>
                <img src="https://boldoutline.in/wp-content/uploads/2019/10/Web-Cover-82.jpg" style={{ width: '100%' , borderRadius:'1px' , height:'220px' }} alt="" />
            </Link>
            </div>
            
            <div className='submainDiv' >
            <Link to="/Influencer/Products/Shoes" style={{ textDecoration: 'none' }}>
                <h4 style={{ justifyContent: 'center', color: 'black', fontWeight: '600', display: 'flex' }}>Shoes</h4>
                <img src="https://www.brownsshoes.com/dw/image/v2/BFTX_PRD/on/demandware.static/-/Sites-BrownsShoes-Library/default/dw906a40b5/images/mosaic/tile3/Browns_Feature-box_Desktop_K202.jpg?sw=896&sh=648" className='fashiImg' style={{ width: '100%' , borderRadius:'1px' , height:'220px' }} alt="" />
            </Link>
            </div>

            <div className='submainDiv'>
            <Link to="/Influencer/Products/Clothing" style={{ textDecoration: 'none' }}>
                <h4 style={{ justifyContent: 'center', color: 'black', fontWeight: '600', display: 'flex' }}>Clothing</h4>
                <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHw%3D&w=1000&q=80" className='fashiImg' style={{ width: '100%' , borderRadius:'1px' , height:'220px' }} alt="" />
            </Link>
            </div>
        </div>
    )
}

export default MainCategories