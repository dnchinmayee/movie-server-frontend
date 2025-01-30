import { useEffect, useState } from 'react';
import { apiRoutes } from './constants';
import MovieSearch from './MovieSearch';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [editedMovie, setEditedMovie] = useState({
        title: "",
        genre: "",
        director: "",
        year: 1970,
        rating: 0
    });

    // Initially fetch all movies
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch(apiRoutes.movies);
            const data = await response.json();
            console.log(data);
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie.id);
        setEditedMovie({
            title: movie.title,
            genre: movie.genre,
            director: movie.director,
            year: movie.year,
            rating: movie.rating
        });
    };

    const handleUpdate = async () => {
        const movieToUpdate = {
            ...editedMovie,
            rating: parseFloat(editedMovie.rating) || 0,
            year: parseInt(editedMovie.year) || 1970
        };
        
        console.log(movieToUpdate);
        try {
            const response = await fetch(`${apiRoutes.movies}/${editingMovie}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieToUpdate)
            });

            if (response.ok) {
                const updatedMovies = movies.map(movie =>
                    movie.id === editingMovie ? { ...movie, ...movieToUpdate } : movie
                );
                setMovies(updatedMovies);
                setEditingMovie(null);
            } else {
                console.error('Failed to update movie');
            }
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedMovie(prev => ({
            ...prev,
            [field]: field === 'rating' ? parseFloat(value) || 0 : 
                     field === 'year' ? parseInt(value) || 1970 : 
                     value
        }));
    };

    const handleSearchResults = (searchResults) => {
        setMovies(searchResults);
    };

    return (
        <div className="container mt-4">
            <h2>Movies List</h2>
            <MovieSearch onSearch={handleSearchResults} />
            {movies.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <input 
                                            type="text"
                                            value={editedMovie.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        movie.title
                                    )}
                                </td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <input 
                                            type="text"
                                            value={editedMovie.genre}
                                            onChange={(e) => handleInputChange('genre', e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        movie.genre
                                    )}
                                </td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <input 
                                            type="text"
                                            value={editedMovie.director}
                                            onChange={(e) => handleInputChange('director', e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        movie.director
                                    )}
                                </td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <input 
                                            type="number"
                                            value={editedMovie.year}
                                            onChange={(e) => handleInputChange('year', e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        movie.year
                                    )}
                                </td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <input 
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={editedMovie.rating}
                                            onChange={(e) => handleInputChange('rating', e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        movie.rating
                                    )}
                                </td>
                                <td>
                                    {editingMovie === movie.id ? (
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={handleUpdate}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingMovie(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="btn btn-warning btn-sm" 
                                            onClick={() => handleEdit(movie)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">
                    No movies found with the given title. Try a different search term.
                </div>
            )}
        </div>
    );
};

export default Movies;