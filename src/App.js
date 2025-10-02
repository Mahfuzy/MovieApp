import Home from './components/HO_components/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth_components/SignIn';
import SignUp from './components/auth_components/SignUp';
import PasswordResetForm from './components/auth_components/PasswordReset';
import ResetPasswordConfirm from './components/auth_components/ResetPasswordConfirm';
import Activate from './components/auth_components/Activate';
import MoviesDetails from './components/Movies_component/MoviesDetails';
import Categories from './components/category_component/Category';
import CategoryDetails from './components/category_component/CategoryDetails';
import PrivateRoute from './components/auth_components/PrivateRoute';
import TvShowsDetails from './components/TVShows_component/TvShowsDetails';
import Navbar from './components/HO_components/Navbar';
import PopularMovies from './components/Movies_component/Popular';
import TopRatedMovies from './components/Movies_component/TopRated';
import UpcomingMovies from './components/Movies_component/UpComing';
import NowPlayingMovies from './components/Movies_component/NowPlaying';
import TvShows from './components/TVShows_component/TvShows';
import AiringTodayTVShows from './components/TVShows_component/AiringToday';
import OnAirTVShows from './components/TVShows_component/OnAir';
import PopularTVShows from './components/TVShows_component/Popular';
import TopRatedTVShows from './components/TVShows_component/TopRated';
import FavoritesPage from './components/Posts/Favorite';
import WatchListPage from './components/Posts/WatchList';
import SearchResults from './components/HO_components/SearchResults';
import Season from './components/TVShows_component/Season';
import Episode from './components/TVShows_component/Episode';



function App() {
  return (
    <Router basename="MovieApp">
      <div className="App">
        <Navbar/>
        <div className="content">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={SignIn} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/reset-password' component={PasswordResetForm} />
            <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
            <Route exact path='/activate/:uid/:token' component={Activate} />
            <Route exact path='/tv-shows/' component={TvShows}/>
  
            <Route exact path='/categories' component={Categories} />
            <Route exact path='/categories/:genre' component={CategoryDetails} />
            <Route path="/search/:query" component={SearchResults} />
            
            {/* Private routes */}
            
            <PrivateRoute exact path="/movie/:id" component={MoviesDetails} />
            <PrivateRoute exact path="/tv/:id" component={TvShowsDetails} />
            <PrivateRoute exact path='/popular/' component={PopularMovies}/>
            <PrivateRoute exact path='/toprated/' component={TopRatedMovies}/>
            <PrivateRoute exact path='/upcoming/' component={UpcomingMovies}/>
            <PrivateRoute exact path='/nowplaying/' component={NowPlayingMovies}/>
            <PrivateRoute exact path='/popular-tv-shows' component={PopularTVShows}/>
            <PrivateRoute exact path='/on-air' component={OnAirTVShows}/>
            <PrivateRoute exact path='/airing-today' component={AiringTodayTVShows}/>
            <PrivateRoute exact path='/top-rated' component={TopRatedTVShows}/>
            <PrivateRoute exact path='/favorites' component={FavoritesPage}/>
            <PrivateRoute exact path='/watchlist' component={WatchListPage}/>
            <PrivateRoute exact path="/tv/:id/season/:seasonNumber" component={Season}/>
            <PrivateRoute exact path="/tv/:id/season/:seasonNumber/episode/:episodeNumber" component={Episode}/>
           

            {/* Redirect to home for unknown routes */}
            <Route component={Home} />
          </Switch>
        </div>
        <div className="Footer">
        </div>
      </div>
    </Router>
  );
}

export default App;
