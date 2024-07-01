import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';

export const MainView = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [movies, setMovies] = useState([]);
    const [isLoadingMovies, setLoadingMovies] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchMovies(); // Fetch movies if user is logged in
        }
    }, []);

    const fetchMovies = async () => {
        setLoadingMovies(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User token not found. Please log in.');
            }

            const response = await fetch('https://moviesflix-hub-fca46ebf9888.herokuapp.com/movies', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setMovies(data);
            setLoadingMovies(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoadingMovies(false);
        }
    };

    const handleLogin = async (userData, authToken) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        fetchMovies();
        return <Navigate to="/movies" />;
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setMovies([]);
        return <Navigate to="/login" />;
    };

    const handleUpdateUser = (updatedUserData) => {
        setUser(updatedUserData);
    };

    const handleAddFavorite = async (movieId) => {
        try {
            if (!user || !user.username) {
                throw new Error('User information is missing. Please log in again.');
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://moviesflix-hub-fca46ebf9888.herokuapp.com/users/${user.username}/favoriteMovies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add favorite movie');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error('Error adding favorite movie:', error);
            alert('Failed to add favorite movie. Please try again.');
        }
    };

    const handleRemoveFavorite = async (movieId) => {
        try {
            if (!user || !user.username) {
                throw new Error('User information is missing. Please log in again.');
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://moviesflix-hub-fca46ebf9888.herokuapp.com/users/${user.username}/favoriteMovies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove favorite movie');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
        } catch (error) {
            console.error('Error removing favorite movie:', error);
            alert('Failed to remove favorite movie. Please try again.');
        }
    };

    return (
        <Router>
            <NavigationBar user={user} onLoggedOut={handleLogout} />
            <Row className="justify-content-md-center">
                <Routes>
                    {!user && <Route path="/" element={<Navigate to="/login" />} />}
                    <Route path="/signup" element={user ? <Navigate to="/" /> : <Col md={5}><SignupView onSignup={handleLogin} /></Col>} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Col md={5}><LoginView onLoggedIn={handleLogin} /></Col>} />
                    <Route path="/" element={<MovieListView movies={movies} isLoading={isLoadingMovies} />} />
                    <Route path="/movies/:title" element={<MovieDetailsView movies={movies} onAddFavorite={handleAddFavorite} onRemoveFavorite={handleRemoveFavorite} />} />
                    <Route path="/profile" element={<ProfileView user={user} movies={movies} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onAddFavorite={handleAddFavorite} onRemoveFavorite={handleRemoveFavorite} />} />
                </Routes>
            </Row>
        </Router>
    );
};

const MovieListView = ({ movies, isLoading }) => {
    if (isLoading) {
        return <Col>Loading...</Col>;
    }

    if (movies.length === 0) {
        return <Col>The movie list is empty!</Col>;
    }

    return (
        <>
            {movies.map((movie) => (
                <Col className="mb-4" key={movie._id} md={3}>
                    <Link to={`/movies/${encodeURIComponent(movie.Title.toLowerCase())}`}>
                        <MovieCard movie={movie} />
                    </Link>
                </Col>
            ))}
        </>
    );
};

const MovieDetailsView = ({ movies, onAddFavorite, onRemoveFavorite }) => {
    const { title } = useParams();
    const movie = movies.find((movie) => movie.Title.toLowerCase() === decodeURIComponent(title.toLowerCase()));

    if (!movie) {
        return <Navigate to="/" />;
    }

    return (
        <MovieView movie={movie} onAddFavorite={onAddFavorite} onRemoveFavorite={onRemoveFavorite} />
    );
};
