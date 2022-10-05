const clientId = 'ceba833aae3a4dd097f7a7466bbdad76'
const redirectUri = 'http://localhost:3000/'
const clientSecret = 'e35d80dd922b44af9eba008b54da00bd'

let accessToken

const Spotify ={
    getAccessToken(){
        if(accessToken){
            return accessToken
        }

        const accessTokenMatch = window.location.href.match(/access_token= ([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in= ([^&]*)/)
        if(accessTokenMatch && expiresInMatch){
            accessToken=accessTokenMatch[1]
            const expiresIn =Number(expiresInMatch[1])
            window.setTimeout(() => (accessToken = ''), expiresIn * 1000)
            window.history.pushState('accessToken',null,'/')
            return accessToken
        }else{
            const accessUri=' https://accounts.spotify.com/en/authorize?client_id=[clientId]&redirect_uri=[redirectUri]&response_type=token&show_dialog=true'
            window.location=accessUri;
        }
    },
    search(term){
        const accessToken=Spotify.getAccessToken();
        return fetch('https://api.spotify.com/v1/search?type=track&q=${term}',{
            headers:{
                authorisation:'Bearer '+ accessToken
            }
        }).then(response => {
            return response.json()
        })
        .then(jsonResponse => {
            if(!jsonResponse.tracks){
                return[];
            }
            return jsonResponse.tracks.item.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                url: track.url
            }));
        });
    },
    // https://accounts.spotify.com/en/authorize?client_id=[YOUR_CLIENT_ID]&redirect_uri=[YOUR_REDIRECT_URI]&response_type=token&show_dialog=true
    savePlaylist(name, trackUrls){
        if(!name || !trackUrls.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorisation: 'Bearer ${accessToken}'}
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers})
            .then(response => response.json())
            .then(jsonResponse => {
                userId=jsonResponse.id;
                return fetch('https://api.spotify.com/v1/users/${userId}/playlists'),{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name:name})}
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId=jsonResponse.id;
                return fetch(
                    'https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks',
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({urls: trackUrls})
                    }
                )
            })


    }
}

export default Spotify;

