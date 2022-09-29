const clientId = 'ceba833aae3a4dd097f7a7466bbdad76'
const redirectUrl = 'http://localhost:3000/'

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
            const accessUrl='https://accounts.spotify.com/authorize?client_id={$clientid}&reponse_type=token&scope=playlist-modify-public&redirect_url=${redirectUrl}'
            window.location=accessUrl;
        }
    },
    search(term){
        const accessToken=spotify.getAccessToken();
        return fetch('https://api.spotify.com/v1/search?type=track&g=${term}',{
            headers:{
                authorisation:'Bearer ${accessToken}'
            }
        }).then(response => {
            return response.json()
        })
        .then(jsonResponse => {
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
                    'https://api.spotify.com/v1/users/${userid}/playlists/${playlistId}/tracks',
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