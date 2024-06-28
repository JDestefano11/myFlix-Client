import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams } from 'react-router-dom';
import { NavigationBar } from '../navigation-bar/navigation-bar';

export const MainView = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [movies, setMovies] = useState([]);
    const [isLoadingMovies, setLoadingMovies] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
    }, [user]);

    const fetchMovies = async () => {
        setLoadingMovies(true);
        try {
            const response = await fetch('https://moviesflix-hub-fca46ebf9888.herokuapp.com/movies', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setMovies([]);
        return <Navigate to="/login" />;
    };

    return (
        <Router>
            <NavigationBar user={user} onLoggedOut={handleLogout} />
            <Row className="justify-content-md-center">
                <Routes>
                    <Route path="/signup" element={user ? <Navigate to="/" /> : <Col md={5}><SignupView onSignup={handleLogin} /></Col>} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Col md={5}><LoginView onLoggedIn={handleLogin} /></Col>} />
                    <Route path="/" element={<MovieList movies={movies} isLoading={isLoadingMovies} />} />
                    <Route path="/movies/:title" element={<MovieDetails movies={movies} />} />
                </Routes>
            </Row>
        </Router>
    );
};

const MovieList = ({ movies, isLoading }) => {
    if (isLoading) {
        return <Col>Loading...</Col>;
    }

    if (movies.length === 0) {
        return <Navigate to="/signup" />;
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

const MovieDetails = ({ movies }) => {
    const { title } = useParams();
    const movie = movies.find((movie) => movie.Title.toLowerCase() === decodeURIComponent(title.toLowerCase()));

    if (!movie) {
        return <Navigate to="/" />;
    }

    return (
        <Col md={8}>
            <MovieView movie={movie} />
        </Col>
    );
};

