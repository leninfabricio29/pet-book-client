import React,{Component} from 'react';


class Profiledetail extends Component {
    render() {
        return (
            <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                <div className="card-body d-block p-4">
                    <h4 className="fw-700 mb-3 font-xsss text-grey-900">About</h4>
                    <p className="fw-500 text-grey-500 lh-24 font-xssss mb-0">Amante de las mascotas Apasionado por el bienestar animal y la compañía peluda. En mi mundo, cada día es mejor con el ronroneo de un gato o el ladrido de un perro. Rescato, cuido y comparto mi vida con estos adorables seres. ¡Únete a mí en este viaje lleno de amor y aventuras!
                    </p>
                    </div>
               

               <hr className='hr'>

               </hr>

                <div className="card-body d-flex pt-0">
                    <i className="feather-eye text-grey-500 me-3 font-lg"></i>
                    <h4 className="fw-700 text-grey-900 font-xssss mt-0">Público <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">Todos pueden ver tu perfil</span></h4>
                </div>
                <div className="card-body d-flex pt-0">
                    <i className="feather-map-pin text-grey-500 me-3 font-lg"></i>
                    <h4 className="fw-700 text-grey-900 font-xssss mt-1">Loja </h4>
                </div>
                
            </div>
        );
    }
}

export default Profiledetail;