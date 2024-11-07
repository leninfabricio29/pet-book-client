import React,{Component} from 'react';
import Slider from "react-slick";

const storyList = [
    {   
        bgUrl: 'dog1.jpg',
        imageUrl: 'lenin.png',
        name: 'Lenin Fabricio ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'dog2.jpg',
        imageUrl: 'man.png',
        name: 'Luis Soto ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'dog3.jpg',
        imageUrl: 'woman.png',
        name: 'Juana Rojas ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'gato1.jpg',
        imageUrl: 'profile.png',
        name: 'Luis Vazques ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'dog2.jpg',
        imageUrl: 'user.png',
        name: 'Studio ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'dog3.jpg',
        imageUrl: 'user.png',
        name: 'Rodrigo Lopez ',
        email: 'support@gmail.com',
    },
    {   
        bgUrl: 'story.png',
        imageUrl: 'user.png',
        name: 'Lenin Fabri ',
        email: 'support@gmail.com',
    },
]

class Storyslider extends Component {
    render() {
        const storysettings = {
            arrows: false,
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            centerMode: false,
            variableWidth: true
        };
        return (
            <>
            
            <div className='alert alert-warning text-center'>
                    <spam>En esta sección verás publicaciones de reportes con más reacciones.</spam>

                </div>
            <Slider {...storysettings}>
                
                {storyList.map((value , index) => (
                <div key={index}>
                    <div className="card w125 h200 d-block border-0 shadow-xss rounded-xxxl bg-gradiant-bottom overflow-hidden cursor-pointer mb-3 mt-0 me-3" style={{backgroundImage: `url("assets/images/${value.bgUrl}")`}}>
                        <div className="card-body d-block p-3 w-100 position-absolute bottom-0 text-center" >
                            <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w50 z-index-1"><img src={`assets/images/${value.imageUrl}`} alt="avater" className="float-right p-0 bg-white rounded-circle w-100 shadow-xss" /></figure>
                            <div className="clearfix mt-1"></div>
                            <h4 className="fw-600 position-relative z-index-1 ls-1 font-xssss text-white mt-2 mb-1">{value.name} </h4>
                        </div>
                    </div>
                </div>
                ))}

                
            </Slider>
            </>
        );
    }
}

export default Storyslider;