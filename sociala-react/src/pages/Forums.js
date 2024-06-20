import React, { Component, Fragment } from "react";
import Header from '../components/Header';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from 'axios';
import "./Chat.css";
import { ToastContainer, toast } from "react-toastify";

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
        };
    }

    componentDidMount() {
        this.fetchForums();
    }

    fetchForums = () => {
        axios.get('http://localhost:5020/api/v1/forums/all')
            .then(response => {
                this.setState({ forums: response.data });
            })
            .catch(error => {
                console.error('Error fetching forums:', error);
            });
    }

    fetchForumDetails = (forumId) => {
        // Si el foro ya está desplegado, colapsarlo
        if (this.state.detailedForumId === forumId) {
            this.handleCloseDetails();
            return;
        }

        axios.get(`http://localhost:5020/api/v1/forums/${forumId}`)
            .then(response => {
                const detailedForumData = response.data;
                this.setState({ detailedForumId: forumId });

                // Guardar las respuestas de los comentarios en una variable
                const respuestas = detailedForumData.answers;
                this.setState({ selectedForumAnswers: respuestas });

                // Realizar solicitud adicional para obtener detalles de cada comentario
                const commentDetailsPromises = respuestas.map(answer =>
                    axios.get(`http://localhost:5020/api/v1/comments/${answer.commentId._id}`)
                );

                Promise.all(commentDetailsPromises)
                    .then(commentResponses => {
                        const commentDetails = commentResponses.map(res => res.data);
                        this.setState({ commentDetails });
                    })
                    .catch(error => {
                        console.error('Error fetching comment details:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching forum details:', error);
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


        const userId = user._id; // Replace with the actual user ID from authentication

        axios.post('http://localhost:5020/api/v1/comments/new', {
            content: newCommentContent,
            forumId,
            createdBy: userId
        })
        .then(response => {
            this.fetchForumDetails(forumId); // Refresh forum details after submitting the comment
            this.setState({ showReplyForm: false, newCommentContent: '' });

            toast.success("Haz respondido este foro")
        })
        .catch(error => {
            console.error('Error posting comment:', error);
        });
    }

    render() {
        const { forums, detailedForumId, selectedForumAnswers, commentDetails, showReplyForm, newCommentContent } = this.state;

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

                                        {forums.map(forum => (
                                            <Fragment key={forum._id}>
                                                <div className="row rounded shadow m-4 p-3 align-items-center">
                                                    <div className="col-2 text-center">
                                                        <img src="https://img.freepik.com/vector-premium/icono-megafono-vector-plantilla-megafono-aislado-ilustracion-vector-megafono-stock-vector-eps-10_158224-305.jpg" width={100} alt="Megaphone Icon" />
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="text-first">
                                                            <div className="mb-2">
                                                                <i className="feather-user m-2"></i>
                                                                <span>Creado por: Fundación Cielo Animal</span>
                                                            </div>
                                                            <div className="mb-2">
                                                                <h2 className="m-2">{forum.question}</h2>
                                                            </div>
                                                            <div className="mb-2">
                                                                <i className="feather-calendar m-2"></i>
                                                                <span>Fecha de creación: {new Date(forum.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="m-2">Respuestas: {forum.answers ? forum.answers.length : 0} hasta ahora</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 text-center">
                                                        <button className="btn btn-info p-2" onClick={() => this.fetchForumDetails(forum._id)}>
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
                                                                    <h2>{forum.question}</h2>
                                                                    <p>Creado por: Fundación Cielo Animal</p>
                                                                    <p>Fecha de creación: {new Date(forum.createdAt).toLocaleDateString()}</p>
                                                                </div>

                                                                <div className="mb-3">
                                                                    <button className="btn btn-success" onClick={this.handleReplyClick}>
                                                                        <i className="feather-plus"></i> Responder
                                                                    </button>
                                                                </div>

                                                                {showReplyForm && (
                                                                    <div className="mb-3">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Escribe tu respuesta aquí..."
                                                                            value={newCommentContent}
                                                                            onChange={this.handleInputChange}
                                                                        />
                                                                        <button className="btn btn-info mt-2" onClick={() => this.handleSubmitReply(forum._id)}>
                                                                            Publicar
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <h3>Respuestas:</h3>
                                                                    <div className="chat-container">
                                                                        {selectedForumAnswers.map((answer, index) => {
                                                                            const commentDetail = commentDetails.find(detail => detail.comment._id === answer.commentId._id);
                                                                            return (
                                                                                <div key={answer._id} className="chat-message mb-3">
                                                                                    {commentDetail && (
                                                                                        <Fragment>
                                                                                            <div className="card mb-3" style={{ maxWidth: '540px' }}>
                                                                                                <div className="row no-gutters">
                                                                                                    <div className="col-md-2 p-4">
                                                                                                        <img src={commentDetail.profileData.profile.photo_profile_url} className="card-img rounded-circle" alt="user" />
                                                                                                    </div>
                                                                                                    <div className="col-md-10">
                                                                                                        <div className="card-body">
                                                                                                            <h5 className="card-title d-flex justify-content-between">
                                                                                                                <p><strong>{commentDetail.profileData.user.name} {commentDetail.profileData.user.last_name}</strong></p>
                                                                                                                <small className="text-muted">
                                                                                                                    <i className="feather-clock" />
                                                                                                                    <span className="chat-timestamp">{new Date(commentDetail.comment.createdAt).toLocaleDateString()}</span>
                                                                                                                </small>
                                                                                                            </h5>
                                                                                                            <p className="card-text">{commentDetail.comment.content}</p>
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

                                                                <button className="btn btn-secondary mt-3" onClick={this.handleCloseDetails}>Cerrar</button>
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
                <ToastContainer>
                    
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    
                </ToastContainer>

                <Popupchat />
                <Appfooter />
            </Fragment>
        );
    }
}

export default Forum;
