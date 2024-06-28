import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
    const cardStyles = {
        width: '250px',
        marginBottom: '20px',
        backgroundColor: '#1a1a1a',
        color: '#f0f0f0',
        border: '1px solid #333',
        borderRadius: '10px',
        margin: '20px'
    };

    const imageStyles = {
        height: '350px',
        objectFit: 'cover',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
    };

    return (
        <Card style={cardStyles}>
            <Card.Img variant="top" src={movie.ImageUrl} alt={movie.Title} style={imageStyles} />
            <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>
                    Genre: {movie.Genre.Name}
                </Card.Text>
                <Link to={`/movies/${encodeURIComponent(movie.Title.toLowerCase())}`} style={{ textDecoration: 'none', color: '#f0f0f0' }}>
                    <button className="btn-link" style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer', border: 'none', background: 'none' }}>
                        Open
                    </button>
                </Link>
            </Card.Body>
        </Card>
    );
};


