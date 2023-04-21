import React from 'react'
import Navbar from '../component/Navbar'
import './orderstatus.css'
import {  SearchOutlined , ListAlt , DoneAll , EmojiEmotions,LocalShipping

} from '@material-ui/icons';

export default function orderstatus() {
    return (
        <>
            <div>
                <div className='main'>
                    <div>
                      <p className='firstTextline'>Track delivery status</p>
                      <ul>
                          <li className='status_line step-completed'>
                              <ListAlt style={{width:50 , height:50 }}/>
                              <span>Order Placed</span>
                            </li>

                          <li className='status_line step-completed'>
                               <DoneAll style={{width:50 , height:50 }}/>
                                <span>Order confirmation</span>
                            </li>
                          <li className='status_line current'>
                              <LocalShipping style={{width:50 , height:50 }}/>
                              <span>Out for delivery</span>
                            </li>
                          <li className='status_line'>
                              <EmojiEmotions style={{width:50 , height:50 }}/>
                              <span>Complete</span>
                            </li>
                      </ul>

                    </div>
                    <p className='secoundTextline'>61ca141d121c121caedf13daf3</p>
                </div>
            </div>
        </>
    )
}
