define(['jquery','song'],function($,Song){
	var consumer_key = "89e7642d86f9241b0d1917ebfae99e38",
		load = function(url,callback){
			url += url.match(/[a-z]*\?/i) ? '&':'?';
			url += 'consumer_key=' + consumer_key+'&format=json&callback=?';
			$.getJSON(url, function(data){
				if(data.tracks){
					done(data.tracks,callback);
				}else if($.isArray(data)){
					done(data, callback);
				}else if(data.creator || data.username){
					//if user or group load tracks
					load(data.uri+'/tracks',callback);
				}
			});
		},
		done = function(data,callback){
			callback($.map(data,function(track){
				if (!track.streamable) {  // Sometimes tracks get pulled
					return new Song({});  // Return a blank, avoids adding to Playlist
				}
				var url = track.stream_url;
				url += url.match(/[a-z]*\?/i) ? '&':'?';
				url += 'consumer_key=' + consumer_key;
				return new Song({
					title:track.title,
					url:url
				});
			}));
		};

	return {
		load:function(url, req, callback, config){
			// Soundcloud may return a 401 Unauthorized if a consumer key is not provided
			load('http://api.soundcloud.com/resolve?consumer_key=' + consumer_key + '&url=' + url,callback);
		}
	}
});

