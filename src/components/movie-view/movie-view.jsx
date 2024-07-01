export const MovieView = ({ movie, user }) => {
    const addToFavorites = async () => {
        try {
            // Check if user and movie objects are defined and have _id properties
            if (!user || !user._id) {
                console.error('User object or user._id is undefined');
                alert('User information is missing. Please log in again.');
                return;
            }

            if (!movie || !movie._id) {
                console.error('Movie object or movie._id is undefined');
                alert('Movie information is missing. Please try again.');
                return;
            }

            console.log('Add to favorites clicked');
            console.log('User ID:', user._id);
            console.log('Movie ID:', movie._id);

            const token = localStorage.getItem('token');
            const response = await fetch(`/users/${user.username}/favoriteMovies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ movieId: movie._id }) // Send movieId in the request body
            });

            console.log('Response status:', response.status);

            let responseData;
            try {
                responseData = await response.json();
                console.log('Response data:', responseData);
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                alert('An error occurred while processing the response. Please try again.');
                return;
            }

            if (response.ok) {
                // Update UI to reflect movie added to favorites (optional)
                alert('Movie added to favorites!');
            } else {
                alert(`Failed to add movie to favorites: ${responseData.message || responseData.errors || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding movie to favorites:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="movie-view">
            <Container>
                {/* Movie details rendering */}
                <Button variant="primary" onClick={addToFavorites}>Add to Favorites</Button>
            </Container>
            <Link to="/" className="back-button">
                Back
            </Link>
        </div>
    );
};
