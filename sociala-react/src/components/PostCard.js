import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import WhatsAppLink from './WhatsAppLink';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {useGoogleMaps} from '../utils/GoogleMapsContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [location, setLocation] = useState(null);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(post.amount_reactions);
  const [commentsCount, setCommentsCount] = useState(post.amount_comments);

  const [commentsDetails, setCommentsDetails] = useState([]);
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
        setCommentsDetails([...commentsDetails, response.data]);
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
            <Link to={`/detailpost/${post._id}`}>
              <i className='feather-maximize-2'></i>
            </Link>
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
              <span className="ms-2">{commentsCount}</span>
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
              
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  zoom={14}
                  center={{ lat: post.location.coordinates[1], lng: post.location.coordinates[0] }}
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
