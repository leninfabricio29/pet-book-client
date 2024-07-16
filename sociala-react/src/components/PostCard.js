import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import WhatsAppLink from './WhatsAppLink';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [location, setLocation] = useState(null);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(post.amount_reactions);
  const [commentsCount, setCommentsCount] = useState(post.amount_comments);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');

  const mensaje = "Tengo información sobre la mascota extraviada que publicaste";

  useEffect(() => {
    const checkUserReaction = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`http://localhost:3010/api/v1/reactions/check`, {
          params: {
            userId: user._id,
            postId: post._id
          }
        });
        setHasReacted(response.data.hasReacted);
      } catch (error) {
        console.error('Error al verificar la reacción del usuario:', error);
      }
    };

    checkUserReaction();
  }, [post._id]);

  const handleShowMap = () => {
    setLocation({
      lat: post.location.coordinates[1],
      lng: post.location.coordinates[0]
    });
  };

  const handleCloseMap = () => {
    setLocation(null);
  };

  const handleReaction = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post('http://localhost:3010/api/v1/reactions/new', {
        userId: user._id,
        postId: post._id
      });

      if (response.status === 201) {
        setReactionsCount(reactionsCount + 1);
        setHasReacted(true);
      } else if (response.status === 409) {
        setHasReacted(true);
      }
    } catch (error) {
      toast.error("Ya reaccionaste a esta publicación");
    }
  };

  const handleShowCommentForm = () => {
    setShowCommentForm(true);
  };

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleNewCommentSubmit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post('http://localhost:3010/api/v1/comments/post/new', {
        content: newComment,
        createdBy: user._id,
        postId: post._id
      });

      if (response.status === 201) {
        setCommentsCount(commentsCount + 1);
        toast.success("Haz hecho un comentario!");
        setNewComment('');
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
    }
  };

  if (post.owner === JSON.parse(localStorage.getItem('user'))._id) {
    return null;
  }

  // Determina la URL de la imagen según el tipo de publicación
  const imageUrl = 
    post.type === 'Avistamiento' ? post.photo_post_url : 
    post.type === 'Perdida' || post.type === 'Adopcion' ? post.petPhoto : '';

  return (
    <div className="card w-100 shadow rounded-xxl border-0 p-4 mb-3">
      <div className='text-first'>
        {post.type === 'Perdida' && <strong className="text-danger mt-2 fw-700 font-xsss">Mascota perdida</strong>}
        {post.type === 'Avistamiento' && <strong className="text-success mt-2 fw-700 font-xsss">Mascota encontrada</strong>}
        {post.type === 'Adopcion' && <strong className="text-secondary mt-2 fw-700 font-xsss">Mascota en adopción</strong>}
      </div>
      <div className="d-flex align-items-center mt-2">
        <div className='col-6 d-flex text-start'>
          <img
            src={post.profilePhoto}
            alt="Profile"
            className="rounded-circle"
            width="40"
            height="40"
          />
          <div className="ms-3">
            <strong className='text-dark font-xsss'>{post.firstName} {post.lastName}</strong>
            <h6 className='text-grey'> Publicado el: {new Date(post.createdAt).toLocaleDateString()}</h6>
          </div>
        </div>

        <div className='col-6 d-flex justify-content-end'>
          <Tooltip title="Ver publicación">
            <Link to={`/detailpost/${post._id}`}>
              <i className='feather-maximize-2'></i>
            </Link>
          </Tooltip>
        </div>
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex align-items-center mt-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Pet"
              className="img-fluid rounded"
              width={150}
            />
          )}
          <div className="ms-3">
            <p className="mb-0 font-xsss text-dark text-md-justify">{post.body}</p>
            {post.type !== 'Adopcion' && <small className="text-muted">Recompensa: {post.reward}</small>}
          </div>
        </div>

        <div className="d-flex mt-4 justify-content-center">
          <div className='shadow rounded m-2'>
          <Tooltip title={hasReacted ? "Te gusta esta publicación" : "Me gusta"}>
            <button className="btn p-2" onClick={handleReaction}>
              <i className="feather-heart" style={{ color: hasReacted ? 'green' : 'grey' }}></i>
              <span className="ms-2">{reactionsCount}  </span>
            </button>
          </Tooltip>
          </div>
          
          <div className='shadow rounded m-2'>

          <Tooltip title="Comentarios">
            <button className="btn p-2" onClick={handleShowCommentForm}>
              <i className="feather-message-square"></i>
              <span className="ms-2">{commentsCount} </span>
            </button>
          </Tooltip>
          </div>

          <div className='shadow rounded m-2'>
          <Tooltip title="Ver lugar de pérdida">
            <button className="btn p-2 ms-2" data-toggle="modal" data-target={`#modalMap-${post._id}`} onClick={handleShowMap}>
              <i className="feather-map-pin"></i>  
            </button>
          </Tooltip>
          </div>

          <div className='shadow rounded m-2'>
            <WhatsAppLink phoneNumber={post.numberPhone} message={mensaje} />



          </div>

          

          

        </div>

        {showCommentForm && (
          <div className="mt-3">
            <form onSubmit={handleNewCommentSubmit}>
              <textarea
                value={newComment}
                onChange={handleNewCommentChange}
                className="form-control"
                rows="3"
                placeholder="Escribe un comentario..."
                required
              ></textarea>
              <div className='text-center'>
              <button type="submit" className="btn btn-info mt-2 font-xssss">Publicar 
                <i className='feather-send mx-2'></i>
                 </button>

              </div>
            </form>
          </div>
        )}
      </div>

      <div className="modal fade" id={`modalMap-${post._id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Lugar de pérdida</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseMap}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                zoom={14}
                center={location || { lat: 0, lng: 0 }} // Default center if location is null
              >
                {location && <Marker position={location} />}
              </GoogleMap>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseMap}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
