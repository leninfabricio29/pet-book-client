import { Tooltip } from '@mui/material';
import React from 'react';

const WhatsAppLink = ({ phoneNumber, message }) => {
    // Codificar el mensaje en formato URL
    const encodedMessage = encodeURIComponent(message);
    // Crear el enlace de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (

        <Tooltip title="Contactar al creador de la publicción">
 <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
             <button className="btn p-2  ms-2">

<i className="feather-phone-call"></i>
 


</button>
        </a>
        </Tooltip>
       
    );
};

export default WhatsAppLink;
