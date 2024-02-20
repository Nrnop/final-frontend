import {Button, Grid, Menu, MenuItem, TextField} from '@mui/material';
import MovieElement from '../Movie/MovieElement.jsx'
import {get} from "../../utils/httpClient.js";
import {useEffect, useState} from "react";


function MoviesList() {
    const [anchorElGenres, setAnchorElGenres] = useState(null);
    const [anchorElYears, setAnchorElYears] = useState(null);
    const [tags, setTags] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedTag, setSelectedTag] = useState(''); // State to hold selected tag
    const [selectedYear, setSelectedYear] = useState(''); // State to hold selected year
    const [movies, setMovies] = useState();

    // Fetch tags and years on component mount
    useEffect(() => {
        const fetchTagsAndYears = async () => {
            try {
                const tagsData = await get('/movies/tags');
                setTags(tagsData);
                const yearsData = await get('/movies/years');
                setYears(yearsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTagsAndYears();
    }, []);

    const filterTagOrYears = async () => {
        try {
            if (selectedTag) {
                console.log(selectedTag);
                const tagFilter = await get(`/movies/tags/${selectedTag}`);
                setMovies(tagFilter);
            } else if (selectedYear) {
                console.log(selectedYear);
                const yearFilter = await get(`/movies/year/${selectedYear}`);
                setMovies(yearFilter);
            } else {
                const allMovies = await get(`/movies`);
                setMovies(allMovies);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        filterTagOrYears();
    }, [selectedTag, selectedYear]);

    const handleGenresMenuClick = (event) => {
        setAnchorElGenres(event.currentTarget);
    };

    const handleGenresMenuClose = (tagName) => {
        setAnchorElGenres(null);
        setSelectedTag(tagName);
    };

    const handleYearsMenuClick = (event) => {
        setAnchorElYears(event.currentTarget);
    };

    const handleYearsMenuClose = (year) => {
        setAnchorElYears(null);
        setSelectedYear(year);
    };


    return (
        <div className="container">
            <Grid container justifyContent="flex-start" alignItems="center" className="header">
                <div className="genre-year-group">
                    <Button color="inherit" className="button" onClick={handleGenresMenuClick}>
                        Genres
                    </Button>
                    <Menu
                        anchorEl={anchorElGenres}
                        open={Boolean(anchorElGenres)}
                        onClose={() => handleGenresMenuClose('')}
                    >
                        {tags && tags.map((tag) => ( // Ensure tags is defined and is an array
                            <MenuItem key={tag.tag_id} onClick={() => handleGenresMenuClose(tag.tag_name)} className="menu-item">
                                {tag.tag_name || 'Unknown Genre'}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Button color="inherit" className="button" onClick={handleYearsMenuClick}>
                        Year
                    </Button>
                    <Menu
                        anchorEl={anchorElYears}
                        open={Boolean(anchorElYears)}
                        onClose={() => handleYearsMenuClose('')}
                    >
                        {years && years.map((year, index) => (
                            <MenuItem key={index} onClick={() => handleYearsMenuClose(year.year)} className="menu-item">
                                {year.year || 'Unknown Year'}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className="search-bar">
                    <TextField label="Search Movie" variant="outlined" size="small" color="primary" className="search-input" />
                </div>
            </Grid>
            <Grid container spacing={2} className="movie-grid">
                {movies && movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie?.id} className="movie-item">
                        <MovieElement movie={movie} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default MoviesList;