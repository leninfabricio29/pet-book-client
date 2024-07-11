import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos de toastify

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendSuggestions: [],
            user_loggued: null,
        };
    }

    componentDidMount() {
        this.fetchFriendSuggestions();
    }

    fetchNewFollow = async (followerId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const profileResponse = await axios.get(`http://localhost:3010/api/v1/profiles/${user._id}`);
            const { data } = profileResponse;

            console.log("Estos es lo que hay en data", data);

            // Envía los IDs de profile y follower en el cuerpo de la solicitud POST
            const response = await axios.post('http://localhost:3010/api/v1/profiles/follow', {
                profileId: data.profile._id,
                followerId: followerId
            });

            toast.info(response.data.message);
            // Opcional: Actualiza el estado o la UI después de seguir a un usuario

        } catch (error) {
            toast.error(error.message || 'Error al seguir al usuario');
        }
    }

    fetchFriendSuggestions = async () => {
        try {
            const response = await axios.get('http://localhost:3010/api/v1/users/list');
            const users = response.data;

            const userLogged = JSON.parse(localStorage.getItem('user'));
            const currentUserID = userLogged._id;

            // Filtrar la lista de usuarios para excluir al usuario actual
            const filteredUsers = users.filter(userItem => {
                const userIdToCompare = userItem.user._id;
                return userIdToCompare !== currentUserID;
            });

            // Filtrar y obtener solo 4 amigos aleatorios
            const friendSuggestions = this.getRandomFriends(filteredUsers, 1);

            this.setState({ friendSuggestions });

        } catch (error) {
            console.error('Error fetching friend suggestions:', error);
        }
    }

    getRandomFriends = (users, count) => {
        // Obtener una lista de índices aleatorios únicos dentro del rango de la longitud de users
        const randomIndexes = [];
        while (randomIndexes.length < count) {
            const randomIndex = Math.floor(Math.random() * users.length);
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        // Obtener los usuarios correspondientes a los índices aleatorios
        const randomFriends = randomIndexes.map(index => users[index]);
        return randomFriends;
    }

    render() {
        const { friendSuggestions } = this.state;

        console.log(friendSuggestions);

        return (
            <div>
                <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                    <div className="card-body d-flex align-items-center p-4">
                        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Recomendaciones</h4>
                        <a href="/defaultmember" className="fw-600 ms-auto font-xssss text-primary">Ver todo</a>
                    </div>
                    {friendSuggestions.map((friend, index) => (
                        <div className="wrap" key={index}>
                            <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
                                <figure className="avatar me-3">
                                    <img src={friend.photo_profile_url} alt="avatar" className="shadow-sm rounded-circle w45" />
                                </figure>
                                <Link to={`/userpage/${friend.user._id}`}>
                                    <h4 className="fw-700 text-grey-900 font-xssss mt-1">
                                        {friend.user.name} {friend.user.last_name} <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">PetBook te lo recomienda</span>
                                    </h4>
                                </Link>
                            </div>
                            <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                                    <a  onClick={() => this.fetchNewFollow(friend._id)}
                                    className="p-2 lh-20 w100 bg-success me-2 text-white text-center font-xssss fw-600 ls-1 pointer 
                                     rounded-xl">Seguir</a>
                                <a href="/defaultmember" className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Ignorar</a>
                            </div>
                        </div>
                    ))}
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        );
    }
}

export default Friends;
