import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from 'axios';
import "./Chat.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Forum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            forums: [],
            detailedForumId: null,
            selectedForumAnswers: [],
            commentDetails: [],
            showReplyForm: false,
            newCommentContent: '',
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchForums();
    }

    fetchForums = () => {
        this.setState({ loading: true });
        axios.get('http://localhost:3010/api/v1/forums/all')
            .then(response => {
                this.setState({ forums: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error fetching forums:', error);
                this.setState({ loading: false, error: 'Error fetching forums' });
            });
    }

    fetchForumDetails = (forumId) => {
        if (this.state.detailedForumId === forumId) {
            this.handleCloseDetails();
            return;
        }

        this.setState({ loading: true });
        axios.get(`http://localhost:3010/api/v1/forums/${forumId}`)
            .then(response => {
                const detailedForumData = response.data;
                const respuestas = detailedForumData.answers;
                this.setState({ detailedForumId: forumId, selectedForumAnswers: respuestas });

                const commentDetailsPromises = respuestas.map(answer =>
                    axios.get(`http://localhost:3010/api/v1/comments/${answer.commentId._id}`)
                );

                return Promise.all(commentDetailsPromises);
            })
            .then(commentResponses => {
                const commentDetails = commentResponses.map(res => res.data);
                this.setState({ commentDetails, loading: false });
            })
            .catch(error => {
                console.error('Error fetching forum details:', error);
                this.setState({ loading: false, error: 'Error fetching forum details' });
            });
    }

    handleCloseDetails = () => {
        this.setState({
            detailedForumId: null,
            selectedForumAnswers: [],
            commentDetails: [],
            showReplyForm: false,
            newCommentContent: ''
        });
    }

    handleReplyClick = () => {
        this.setState({ showReplyForm: true });
    }

    handleInputChange = (event) => {
        this.setState({ newCommentContent: event.target.value });
    }

    handleSubmitReply = (forumId) => {
        const { newCommentContent } = this.state;
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user._id;

        axios.post('http://localhost:3010/api/v1/comments/new', {
            content: newCommentContent,
            forumId,
            createdBy: userId
        })
        .then(response => {
            this.fetchForumDetails(forumId);
            this.setState({ showReplyForm: false, newCommentContent: '' });
            toast.success("Haz respondido este foro");
        })
        .catch(error => {
            console.error('Error posting comment:', error);
            toast.error("Error posting comment");
        });
    }

    render() {
        const { forums, detailedForumId, selectedForumAnswers, commentDetails, showReplyForm, newCommentContent, loading, error } = this.state;

        return (
            <Fragment>
                <Header />
                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="container p-4">
                                        <div className="alert alert-info">
                                            <span>Este espacio está destinado a que compartas tus puntos de vista, puedes filtrar los foros por semana, días, mes</span>
                                        </div>
                                        {loading }
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        {forums.map(forum => (
                                            <Fragment key={forum._id}>
                                                <div className="row rounded shadow m-4 p-3 align-items-center">
                                                    <div className="col-2 text-center">
                                                        <img src="https://cdn.icon-icons.com/icons2/2496/PNG/512/forum_icon_150292.png" width={100} alt="Megaphone Icon" />
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="text-first">
                                                            <div className="mb-2">
                                                                <i className="feather-user m-2"></i>
                                                                <strong className='font-xssss text-grey-500'>Fundación Cielo Animal</strong>  
                                                            </div>
                                                            <div className="mb-2">
                                                                <i className="feather-help-circle m-2"></i>
                                                                <strong className="fw-700 font-xsss text-dark-500">{forum.question}</strong>
                                                            </div>
                                                            <div className="mb-2">
                                                                <i className="feather-calendar m-2"></i>
                                                                <span className="fw-700 font-xssss text-grey-500">Habilitado desde: {new Date(forum.createdAt).toLocaleDateString()}</span>
                                                        
                                                            </div>

                                                            <div className="mb-2">
                                                            <strong className="fw-700 font-xsss m-2 text-grey-500 ">Estado: </strong>
                                                                {forum.status.trim().toLowerCase() === "active" ? (
                                                                    <spam className="text-success">Activo</spam>
                                                                ) : (
                                                                    <strong>Inactivo</strong>
                                                                )}

                                                            </div>
                
                                                            
                                                            <strong className="fw-700 font-xsss m-2 text-grey-500">Respuestas: {forum.answers ? forum.answers.length : 0}</strong>
                                                                
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-4 text-center">
                                                    
                                                        <button className="btn btn-info p-2 fw-700 font-xssss text-light'" onClick={() => this.fetchForumDetails(forum._id)}>
                                                            {detailedForumId === forum._id ? (
                                                                <>
                                                                    <i className="feather-eye-off"></i> Cerrar Foro
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="feather-eye"></i> Ver foro
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                {detailedForumId === forum._id && (
                                                    <div className="row rounded shadow m-4 p-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="mb-3">
                                                                    <h2 className="fw-700 text-dark font-xss">{forum.question}</h2>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <button className="btn btn-success fw-700 font-xsssss text-light" onClick={this.handleReplyClick}>
                                                                        <i className="feather-plus"></i> Responder
                                                                    </button>
                                                                </div>
                                                                {showReplyForm && (
                                                                    <div className="mb-3">
                                                                        <input
                                                                            
                                                                            type="text"
                                                                            required
                                                                            className="form-control"
                                                                            placeholder="Escribe tu respuesta aquí..."
                                                                            value={newCommentContent}
                                                                            onChange={this.handleInputChange}
                                                                        />
                                                                        <button className="btn btn-info mt-2 font-xssss fw-700" onClick={() => this.handleSubmitReply(forum._id)}>
                                                                            Publicar
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <h3 className="fw-700 font-xsss text-grey-500">Respuestas:</h3>
                                                                    <div className="">
                                                                        {selectedForumAnswers.map((answer, index) => {
                                                                            const commentDetail = commentDetails.find(detail => detail.comment._id === answer.commentId._id);
                                                                            return (
                                                                                <div key={answer._id} className="">
                                                                                    {commentDetail && (
                                                                                        <Fragment>
                                                                                            <div className="card mb-3  shadow " style={{ maxWidth: '540px' }}>
  <div className="row g-0">
    <div className="col-md-2 d-flex align-items-center justify-content-center">
      <img
        src={commentDetail.profileData.profile.photo_profile_url}
        className="rounded-circle mx-4"
        width="40"
        height="40"
        alt="user"
      />
    </div>
    <div className="col-md-10">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-muted font-xssss">
            <strong>{commentDetail.profileData.user.name} {commentDetail.profileData.user.last_name}</strong>
          </h5>
          <small className="text-muted">
            <i className="feather-clock" >            <span className="chat-timestamp ms-1">{new Date(commentDetail.comment.createdAt).toLocaleDateString()}</span>
            </i>
          </small>
        </div>
        <spam className="font-xssss text-dark">{commentDetail.comment.content}</spam>
      </div>
    </div>
  </div>
</div>

                                                                                        </Fragment>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <button className="btn btn-secondary mt-3 font-xsss fw-700" onClick={this.handleCloseDetails}>Cerrar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default Forum;
