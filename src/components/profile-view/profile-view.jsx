import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const ProfileView = ({ user, movies, onUpdateUser, onLogout, onAddFavorite, onRemoveFavorite }) => {
    const [isLoadingProfile, setLoadingProfile] = useState(true);
    const [updatedUser, setUpdatedUser] = useState({ ...user, FavoriteMovies: [] }); // Initialize FavoriteMovies array
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setLoadingProfile(true);
        fetchUserProfile(user.username);
    }, [user]);

    const fetchUserProfile = async (username) => {
        try {
            const response = await fetch(`https://moviesflix-hub-fca46ebf9888.herokuapp.com/users/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const userData = await response.json();
            setUpdatedUser(userData);
            setLoadingProfile(false);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setLoadingProfile(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://moviesflix-hub-fca46ebf9888.herokuapp.com/users/${user.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            const updatedUserData = await response.json();
            onUpdateUser(updatedUserData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert('Failed to update user profile. Please try again.');
        }
    };

    const handleFavoriteClick = (movieId) => {
        const isFavorite = updatedUser.FavoriteMovies.includes(movieId);
        if (isFavorite) {
            onRemoveFavorite(movieId);
        } else {
            onAddFavorite(movieId);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    if (isLoadingProfile) {
        return <Col>Loading Profile...</Col>;
    }

    return (
        <Col md={8}>
            <Card>
                <Card.Body>
                    <Card.Title>Profile Information</Card.Title>
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>
                                Username
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={updatedUser.username}
                                    readOnly={!editMode}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>
                                Email
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={updatedUser.email}
                                    readOnly={!editMode}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>
                                Date of Birth
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="date"
                                    name="birthdate"
                                    value={updatedUser.birthdate}
                                    readOnly={!editMode}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        {editMode ? (
                            <div className="text-end">
                                <Button variant="secondary" className="me-2" onClick={toggleEditMode}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        ) : (
                            <Button variant="primary" onClick={toggleEditMode}>
                                Edit Profile
                            </Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>Favorite Movies</Card.Title>
                    {updatedUser.FavoriteMovies && updatedUser.FavoriteMovies.length === 0 ? (
                        <p>No favorite movies selected.</p>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {movies
                                .filter((movie) => updatedUser.FavoriteMovies.includes(movie._id))
                                .map((movie) => (
                                    <Col key={movie._id}>
                                        <Card>
                                            <Card.Img variant="top" src={movie.ImagePath} />
                                            <Card.Body>
                                                <Card.Title>{movie.Title}</Card.Title>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleFavoriteClick(movie._id)}
                                                >
                                                    {updatedUser.FavoriteMovies.includes(movie._id)
                                                        ? 'Remove from Favorites'
                                                        : 'Add to Favorites'}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            <div className="text-end mt-4">
                <Button variant="danger" onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </Col>
    );
};