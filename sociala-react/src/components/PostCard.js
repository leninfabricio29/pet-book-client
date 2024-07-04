import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import WhatsAppLink from './WhatsAppLink';
import { GoogleMap, Marker } from '@react-google-maps/api';
import GoogleMapsAPI from '../utils/google-maps-api';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
  const [location, setLocation] = useState(null);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(post.amount_reactions);
  const [commentsCount, setCommentsCount] = useState(post.amount_comments);

  const [postDetails, setPostDetails] = useState(null); // Estado para los detalles del post
  const [commentsDetails, setCommentsDetails] = useState([]); // Estado para los detalles de los comentarios
  const [showCommentForm, setShowCommentForm] = useState(false); // Estado para mostrar el formulario de comentarios
  const [newComment, setNewComment] = useState(''); // Estado para el nuevo comentario

  const mensaje = "Tengo información sobre la mascota extraviada que publicaste";

  useEffect(() => {
    const checkUserReaction = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`http://localhost:5020/api/v1/reactions/check`, {
          params: {
            userId: user._id,
            postId: post._id
          }
        });

        if (response.data.hasReacted) {
          setHasReacted(true);
        }
      } catch (error) {
        console.error('Error al verificar la reacción del usuario:', error);
      }
    };

    checkUserReaction();
  }, [post._id]);

  const handleShowMap = () => {
    const newLocation = {
      lat: post.location.coordinates[1],
      lng: post.location.coordinates[0]
    };
    setLocation(newLocation);
  };

  const handleCloseMap = () => {
    setLocation(null);
  };

  const handleReaction = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post('http://localhost:5020/api/v1/reactions/new', {
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

  const handleShowDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5020/api/v1/posts/${post._id}`);
      const comments = response.data.comments;

      // Hacer solicitudes para obtener cada comentario
      const commentsDetails = await Promise.all(comments.map(async (comment) => {
        const commentResponse = await axios.get(`http://localhost:5020/api/v1/comments/${comment._id}`);
        return commentResponse.data;
      }));

      setPostDetails(response.data);
      setCommentsDetails(commentsDetails); // Establecer detalles de los comentarios
    } catch (error) {
      console.error('Error al obtener los detalles del post:', error);
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
      const response = await axios.post('http://localhost:5020/api/v1/comments/post/new', {
        content: newComment,
        createdBy: user._id,
        postId: post._id
      });



      if (response.status === 201) {
        setCommentsCount(commentsCount + 1);
        toast.success("Haz hecho un comentario! ")
        setCommentsDetails([...commentsDetails, response.data]);
        setNewComment('');
        setShowCommentForm(false);

        window.location.reload();

      }
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
    }
  };

  if (post.owner === JSON.parse(localStorage.getItem('user'))._id) {
    // Si el usuario actual es el autor de la publicación, no renderizar la tarjeta
    return null;
  }

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="d-flex align-items-around">
        <div className='col-6 d-flex text-start'>
          <img
            src={post.profilePhoto}
            alt="Profile"
            className="rounded-circle"
            width="40"
            height="40"
          />
          <div className="ms-3">
            <h6 className='text-dark'>{post.firstName} {post.lastName}</h6>
          </div>
        </div>

        <div className='col-6 d-flex justify-content-end'>
          <Tooltip title="Ver publicación">
            <a href={`/detailpost/${post._id}`}>
              ir a detalles
            </a>
            <button  className='btn btn-transparent' data-bs-toggle="modal" data-bs-target={`#modalDetails-${post._id}`} onClick={handleShowDetails}>
              <i className='feather-maximize-2'></i>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex align-items-center mt-4">
          <img
            src={post.petPhoto}
            alt="Pet"
            className="img-fluid rounded"
            width={150}
          />
          <div className="ms-3">
            <p className="mb-0">{post.body}</p>
            <small className="text-muted">Recompensa: {post.reward}</small>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <Tooltip title={hasReacted ? "Te gusta esta publicación" : "Me gusta"}>
            <button className="btn p-2" onClick={handleReaction}>
              <i className="feather-heart" style={{ color: hasReacted ? 'green' : 'black' }}></i>
              <span className="ms-2">{reactionsCount}</span>
            </button>
          </Tooltip>

          <Tooltip title="Comentarios">
            <button className="btn p-2" onClick={handleShowCommentForm}>
              <i className="feather-message-square"></i>
              <span className="ms-2">{post.amount_comments}</span>
            </button>
          </Tooltip>

          <Tooltip title="Ver lugar de pérdida">
            <button className="btn p-2 ms-2" data-toggle="modal" data-target={`#modalMap-${post._id}`} onClick={handleShowMap}>
              <i className="feather-map-pin"></i>
            </button>
          </Tooltip>

          <WhatsAppLink phoneNumber={post.numberPhone} message={mensaje} />
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
              <button type="submit" className="btn btn-primary mt-2">Publicar comentario</button>
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
              <GoogleMapsAPI googleMapsApiKey={"AIzaSyBJV8sX5ObZJB4V0gy6ILSqjEcVOYOMcZ4"}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  zoom={14}
                  center={{ lat: post.location.coordinates[1], lng: post.location.coordinates[0] }}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </GoogleMapsAPI>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseMap}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id={`modalDetails-${post._id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Detalles de la publicación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className='modal-body'>
              {postDetails ? (
                <div className='row d-flex'>
                  <div className='col'>
                    <img className='cover rounded pt-4 pb-4 bg-dark' src={post.petPhoto} alt="Pet"/>
                  </div>

                  <div className='col'>
                    <div className='row d-flex'>
                      <div className='col-6 d-flex text-start p-2'>
                        <img
                          src={post.profilePhoto}
                          alt="Profile"
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                        <small className='text-dark m-2'>{post.firstName} {post.lastName}</small>
                      </div>

                      <hr className='hr'></hr>
                    </div>

                    <div className='text-center'>
                    <Tooltip title={hasReacted ? "Te gusta esta publicación" : "Me gusta"}>
            <button className="btn p-2" onClick={handleReaction}>
              <i className="feather-heart" style={{ color: hasReacted ? 'green' : 'black' }}></i>
              <span className="ms-2">{reactionsCount}</span>
            </button>
          </Tooltip>

          <Tooltip title="Comentarios">
            <button className="btn p-2" onClick={handleShowCommentForm}>
              <i className="feather-message-square"></i>
              <span className="ms-2">{post.amount_comments}</span>
            </button>
          </Tooltip>
                      </div>

                    <div className="mt-4 chat-container">
                      <h6>Comentarios</h6>
                      {commentsDetails.length > 0 ? (
                        commentsDetails.map((comment) => (
                          <div key={comment._id} className="comment mb-2">
                            <div className="d-flex ">
                              <img
                                src={comment.profileData.profile.photo_profile_url}
                                alt="User"
                                className="rounded-circle"
                                width="30"
                                height="30"
                              />
                              <div className="ms-2 border p-2 rounded shadow flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="text-muted mb-0">{comment.profileData.user.name} {comment.profileData.user.last_name}</h6>
                                  <h6 className="mb-0">{new Date(comment.comment.createdAt).toLocaleDateString()}</h6>
                                </div>
                                <div className="mt-2">
                                  <p className="mb-1 h6">{comment.comment.content}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No hay comentarios</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>Cargando detalles...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
