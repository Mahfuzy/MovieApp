import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PasswordResetForm from './PasswordReset';
import ResetPasswordConfirm from './ResetPasswordConfirm';
import Activate from './Activate';
import MoviesList from './MoviesList';
import MoviesDetails from './MoviesDetails';
import Categories from './Category';
import CategoryDetails from './CategoryDetails';
import PrivateRoute from './PrivateRoute';
import TvShowsDetails from './TvShowsDetails';
import Navbar from './Navbar';
import PopularMovies from './Popular';
import TopRatedMovies from './TopRated';
import UpcomingMovies from './UpComing';
import NowPlayingMovies from './NowPlaying';
import TvShows from './TvShows';
import TvDisplay from './TvDisplay';


function App() {
  return (
    <Router>
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

            {/* Private routes */}
            <PrivateRoute exact path='/movies' component={MoviesList} />
            <PrivateRoute exact path="/movies/:id" component={MoviesDetails} />
            <PrivateRoute exact path="/shows" component={TvShows} />
            <PrivateRoute exact path="/shows/:id" component={TvShowsDetails} />
            <PrivateRoute exact path='/categories' component={Categories} />
            <PrivateRoute exact path='/categories/:genre' component={CategoryDetails} />
            <PrivateRoute exact path='/popular/' component={PopularMovies}/>
            <PrivateRoute exact path='/toprated/' component={TopRatedMovies}/>
            <PrivateRoute exact path='/upcoming/' component={UpcomingMovies}/>
            <PrivateRoute exact path='/nowplaying/' component={NowPlayingMovies}/>
            <PrivateRoute exact path='/tv-shows/' component={TvDisplay}/>

            {/* Redirect to home for unknown routes */}
          </Switch>
        </div>
        <div className="Footer">
        </div>
      </div>
    </Router>
  );
}

export default App;
