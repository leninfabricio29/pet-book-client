import React, { useState, useEffect , Fragment} from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';



const DetailPost = () => {
  const { id } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [commentsDetails, setCommentsDetails] = useState([]);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(0);
 

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5020/api/v1/posts/${id}`);
        setPostDetails(response.data);

        console.log(response.data)

        setReactionsCount(response.data.amount_reactions);

        const comments = response.data.comments;
        const commentsDetails = await Promise.all(
          comments.map(async (comment) => {
            const commentResponse = await axios.get(`http://localhost:5020/api/v1/comments/${comment._id}`);
            return commentResponse.data;
          })
        );

        setCommentsDetails(commentsDetails);
      } catch (error) {
        console.error('Error al obtener los detalles del post:', error);
      }
    };

    const checkUserReaction = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`http://localhost:5020/api/v1/reactions/check`, {
          params: {
            userId: user._id,
            postId: id
          }
        });

        if (response.data.hasReacted) {
          setHasReacted(true);
        }
      } catch (error) {
        console.error('Error al verificar la reacción del usuario:', error);
      }
    };

    fetchPostDetails();
    checkUserReaction();
  }, [id]);



  

  

  

  if (!postDetails) {
    return <div>Cargando detalles...</div>;
  }

  return (

    

    <Fragment>
    <Header />
    <Leftnav />
    <Rightchat />

    <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left">
                                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                <div className="container border p-2">
  <div className="row">
    <div className="col-md-4">
      <img className='cover rounded pt-4 pb-4 bg-dark' src={postDetails.petPhoto} alt="Pet" />
    </div>
    <div className="col-md-8">
      <div className='row d-flex align-items-center'>
        <div className='col-6 d-flex text-start p-2'>
          <img
            src={postDetails.profilePhoto}
            alt="Profile"
            className="rounded-circle"
            width="40"
            height="40"
          />
          <small className='text-dark m-2'>{postDetails.firstName} {postDetails.lastName}</small>
        </div>
        <hr className='hr' />
      </div>
      <div className="text-center justify-content-center align-items-center">
        <Tooltip title={hasReacted ? "Te gusta esta publicación" : "Me gusta"}>
          <button className="btn p-2" >
            <i className="feather-heart" style={{ color: hasReacted ? 'green' : 'black' }}></i>
            <span className="ms-2">{reactionsCount}</span>
          </button>
        </Tooltip>
        <Tooltip title="Comentarios">
          <button className="btn p-2" >
            <i className="feather-message-square"></i>
            <span className="ms-2">{postDetails.amount_comments}</span>
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
</div>

                                </div>
                            
                        </div>
                    </div>
                </div>

    

    </Fragment>
   
  );
};

export default DetailPost;
