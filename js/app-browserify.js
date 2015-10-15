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
			<ul id='trackListItems'>
				{trackArray.map(this._getTracks)}
			</ul>
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

	render: function(){
		return(
			<p id='blank'></p>
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
		return(
			<div id='playControls'>
				<img id='albumCover' src={this.props.trackData.artwork_url}> </img>
	        	<i id='play' className="material-icons">play_arrow</i>

	        	<i id='stop' className="material-icons">pause</i>

        	</div>
			)
	}

})

var MetaData = React.createClass({

	render: function(){
		return(
			<p id='favoriteCount'><i className="material-icons">favorite_border</i>&nbsp;&nbsp;{this.props.trackData.favoritings_count}<br></br><i className="material-icons">play_circle_filled</i>&nbsp;&nbsp;{this.props.trackData.playback_count}</p>
			)
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
		'*anyroute': 'showDefault'
	},

	showDefault: function(){
		SC.get('/playlists/94327379/tracks').then(function(tracks){
			React.render(<DisplayOverall trackData={tracks}/>,document.querySelector('#container'))		
		})
	},

	_scStreamCallback: function(sound){
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
			
			on(state-change,function(){
				console.log('state changed')
			})
		})
	},

	playTrack: function(trackId){
		console.log('playTrack running')
		SC.get('tracks/'+trackId).then(function(track){
			React.render(<TrackPlayer singleTrackData={track} />,document.querySelector('#containerTwo'))		
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
