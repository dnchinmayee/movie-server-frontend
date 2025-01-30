import { useState } from 'react';
import { apiRoutes } from './constants';

const MovieSearch = ({ onSearch }) => {
    const [searchTitle, setSearchTitle] = useState("");

    const handleSearch = async () => {
        try {
            const response = await fetch(`${apiRoutes.searchMovies}?title=${encodeURIComponent(searchTitle)}`);
            const data = await response.json();
            onSearch(data);
        } catch (error) {
            console.error('Error searching movies:', error);
            onSearch([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="row mb-3">
            <div className="col-md-6">
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter movie title to search" 
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSearch}
                    >
                        Search Movies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieSearch;
