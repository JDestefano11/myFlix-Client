import React, { useState, useEffect } from 'react';
import { Col, Button, Form, Card } from 'react-bootstrap';

export const ProfileView = ({ user, movies, onUpdateUser, onDeregister, onAddFavorite, onRemoveFavorite }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://your-backend-api-url/users/${user.username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(data);
                setUsername(data.username);
                setEmail(data.email);
                setDob(data.dob);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user.username]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://your-backend-api-url/users/${user.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ username, password, email, dob }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
            onUpdateUser({ username, email, dob });
            alert('User information updated successfully!');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user information. Please try again.');
        }
    };

    const handleDeregister = async () => {
        if (window.confirm('Are you sure you want to deregister? This action cannot be undone.')) {
            try {
                const response = await fetch(`https://your-backend-api-url/users/${user.username}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to deregister user');
                }
                onDeregister();
                alert('User deregistered successfully.');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } catch (error) {
                console.error('Error deregistering user:', error);
                alert('Failed to deregister user. Please try again.');
            }
        }
    };

    const handleAddFavorite = (movieId) => {
        onAddFavorite(movieId);
    };

    const handleRemoveFavorite = (movieId) => {
        onRemoveFavorite(movieId);
    };

    if (loading) {
        return <Col>Loading...</Col>;
    }

    if (error) {
        return <Col>Error: {error}</Col>;
    }

    if (!userData) {
        return null;
    }

    // Filter movies to display only favorite movies
    const favoriteMovies = movies.filter(movie => userData.favoriteMovies.includes(movie._id));

    return (
        <Col md={8}>
            <h2>Profile Information</h2>
            <Form onSubmit={handleUpdate}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formDob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Profile
                </Button>
            </Form>
            <Button variant="danger" className="ml-3" onClick={handleDeregister}>
                Deregister
            </Button>

            <h3 className="mt-4">Favorite Movies</h3>
            {favoriteMovies.length > 0 ? (
                <div>
                    {favoriteMovies.map(movie => (
                        <Card key={movie._id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>Year: {movie.year}</Card.Text>
                                <Button variant="danger" onClick={() => handleRemoveFavorite(movie._id)}>Remove from Favorites</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No favorite movies added.</p>
            )}
        </Col>
    );
};

