// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

// ===============================================


SC.initialize({
	client_id: '2c8a2f7e83105618d09cc4d2c1deac90'
    	// redirect_uri: 'http://example.com/callback'
});

$(document).ready(function(){



// =====  REACT ELEMENTS  =====

var DisplayOverall = React.createClass({

	render: function(){
		console.log(this)
		return(
			<div id='displayOverall'>				
				<TrackListings trackData={this.props.trackData} />
			</div>
			)
	}

})

var TrackListings = React.createClass({

	getInitialState: function(){
		return{
			focusId: null
		}
	},

	_handleClick: function(event){
		//code below isolates the track id, which is stored in the data-id attribute on the <li>
		var trackClicked = event.target
		var trackId = trackClicked.dataset.id
		console.log(trackId)
		location.hash = 'play/' + trackId
	},

	_getTracks: function(track){
		console.log('get tracks this:')
		console.log(this)

		return(
			<li data-id={track.id} onClick={this._handleClick}>{track.title}</li>
			)
	},

	render: function(){
		console.log('tracklistings rendering')
		console.log(this)
		var trackArray = this.props.trackData
		return(
			<div>
				<p id='results'> 
					Results 
				</p>
				<ul id='trackListItems'>
					{trackArray.map(this._getTracks)}
				</ul>
			</div>
			)
	}

})


var TrackPlayer = React.createClass({

	render: function(){
		console.log('track player rendering')
		return(
			<div id='TrackPlayer' className='animated fadeInUp'>
				<TrackState trackData={this.props.singleTrackData} />
				<MainInfo trackData={this.props.singleTrackData} />
				<TrackProgress trackData={this.props.singleTrackData} />
				<MetaData trackData={this.props.singleTrackData} />
			</div>
			)
	}
})



var MainInfo = React.createClass({

	render: function(){
		console.log('MainInfo rendering')
		console.log(this)

		return(
			<div id='MainInfo'>
				<p id='trackArtist'>{this.props.trackData.user.username}</p>
				<p id='trackTitle'>{this.props.trackData.title}</p>
			</div>
			)
	}

})

var TrackProgress = React.createClass({

	// getInitialState: function(){
	// 	return{
	// 		ticking: true,
	// 		width: 0
	// 	}
	// },

	// _tickForward: function(){
	// 	var self = this
	// 	var trackLength = this.props.trackData.duration
	// 	console.log(trackLength)
	// 	if(this.state.width < trackLength){
			
	// 		var go = setInterval(function(){
	// 			self.setState({
	// 			//below +2 is because we are multiplying the track length in seconds times 2 in order to double the length of the line (purely for styling purposes)
	// 			width: self.state.width + 0.1,
	// 			ticking: true
	// 			})
	// 		},1000)
	// 	}
	// },

	render: function(){
		// var trackLength = this.props.trackData.duration
		// console.log('duration:')
		// console.log(trackLength)
		// // below should come out to about 400px for average song length
		// var grayBarWidth = (trackLength / 1000) * 2 
		// var orangeBarStyle = {width: this.state.width, 'max-width':grayBarWidth}
		// var grayBarStyle = {width: grayBarWidth}

		return(
			<div id='barOne' >
				<p id='orangeBar'  ></p>
			</div>
			)
	}

})

var TrackState = React.createClass({

	_clickHandler: function(event){
		var clickedIcon = event.target;
		console.log(clickedIcon)
		clickedIcon.display = none;
	},

	render: function(){
		
		if(this.props.trackData.artwork_url){

		return(
			<div id='playControls'>
				<img id='albumCover' src={this.props.trackData.artwork_url}> </img>
	        	<i id='play' className="material-icons">play_arrow</i>

	        	<i id='stop' className="material-icons">pause</i>

        	</div>
			)
		}
		else{

			return(
			<div id='playControls'>
				<img id='albumCover' src='images/white-square.png'> </img>
	        	<i id='play' className="material-icons">play_arrow</i>

	        	<i id='stop' className="material-icons">pause</i>

        	</div>
			)


		}
	}

})

var MetaData = React.createClass({

	render: function(){
		return(
			<p id='favoriteCount'><i className="material-icons">favorite_border</i>&nbsp;&nbsp;{this.props.trackData.favoritings_count}<br></br><i className="material-icons">play_circle_filled</i>&nbsp;&nbsp;{this.props.trackData.playback_count}</p>
			)
	}

})


// =====  RECEIVE SEARCH INPUT =====

$('#searchbar').keypress(function(event){
	if (event.keyCode == 13){
		console.log('Enter!')
		var searchbar = event.target
		var searchTerm = searchbar.value;
		// SC.sound.pause()
		location.hash = 'search/' + searchTerm
		searchbar.value = '';

	}
})


// =====  SOUNDCLOUD SDK =====
// 

// SC.get('/playlists/94327379/tracks').then(function(tracks){
// 	React.render(<DisplayOverall trackData={tracks}/>,document.querySelector('#container'))		
// })


// =====  ROUTING =====
// 
var SoundRouter = Backbone.Router.extend({

	routes: {
		'play/:trackId': 'playTrack',
		'search/:searchTerm': 'runSearch',
		'*anyroute': 'showDefault'
	},

	showDefault: function(){
		SC.get('/playlists/94327379/tracks').then(function(tracks){
			React.render(<DisplayOverall trackData={tracks}/>,document.querySelector('#container'))		
		})
	},

	runSearch: function(searchTerm){
		console.log(searchTerm)
		var self = this

		SC.get('/tracks', {
			q:searchTerm,
			license: 'cc-by-sa'}
			).then(function(tracks){
				console.log('here it is:')
				console.log(tracks)
				var firstTrackId = tracks[0].id
				console.log(firstTrackId)
				React.render(<DisplayOverall trackData={tracks}/>,document.querySelector('#container'))		
				// React.unmountComponentAtNode(document.getElementById('containerTwo'));
		})
		// after rendering Display overall, should re-render track player with first track in array?
	},

	_scSearchCallback: function(data){
		console.log('running _scSearchCallback')
		var firstTrackId = this.props.trackData[0].id
		console.log('first track id:')
		console.log(firstTrackId)
		SC.stream('tracks/'+firstTrackId)
	},

	_scStreamCallback: function(sound){
		SC.sound = sound

		console.log('Sound:')
		console.log(sound)
		$('#play').click(function(){
			console.log('clicked!')
			$('#play').hide;	
			sound.play()
		})
		$('#stop').click(function(){
			console.log('clicked!')
			sound.pause()			
		})
		
	},

	_streamTrack: function(trackId){
		SC.stream('/tracks/'+ trackId).then(function(sound){
			SC.sound = sound
			console.log('streaming!')
			console.log(sound)
			//below line makes it so that song immediately plays when clicked

			sound.play()
			$('#play').hide()
			$('#stop').click(function(){
				console.log('clicked!')
				$(this).hide()
				$('#play').show()
				sound.pause()			
			})
			$('#play').click(function(){
				console.log('clicked!')
				$(this).hide()
				$('#stop').show()
				sound.play()			
			})
			
		})
	},

	playTrack: function(trackId){
		console.log('playTrack running')
		SC.get('tracks/'+trackId).then(function(track){
			React.render(<TrackPlayer singleTrackData={track} />,document.querySelector('#containerTwo'))		
		}).then(function(){
			$('#stop').show()
		}).then(this._streamTrack(trackId))
		
	},

	initialize: function(){		
		Backbone.history.start()	
	}

})

var sr = new SoundRouter()

// ---------------------------------------------
// BELOW CODE CORRECTLY PLAYS/PAUSES STREAM
	// SC.stream('/tracks/187289665').then(function(sound){
	// 		console.log(sound)
	// 		$('#play').click(function(){
	// 			console.log('clicked!')
	// 			sound.play()			
	// 		})
	// 		$('#stop').click(function(){
	// 			console.log('clicked!')
	// 			sound.pause()			
	// 		})
	// 		on(state-change,function(){
	// 			console.log('state changed')
	// 		})
	// })		
// ---------------------------------------------


})
