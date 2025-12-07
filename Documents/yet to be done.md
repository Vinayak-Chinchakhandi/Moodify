see in recomendations  there oonly 9 cards in grid but our api will fetch many songs so now increase the size of grid  make more  grid elements it has to be dynamic like based on number of songs fetched its should be append below scrollbar should be enabled and find more button if user wants more songs 

the audioplayer,back button and this new more find button has to be fixed in below of container and grid elements can be scrollable based on songs fetched

you tube api created files not there

hf api created = functionality should be added

all 3 are ready separately integrate them their type and format from each type give it to youtube api and it will fetch songs in audio player one button like stream if clicked new page openand video played in full screen mode back button in top left once clicked come back to previous recomendation page where we cna play songs

in audio player if like icon clicked song added to lpaylist sing id store in firebase 

to add to playlist + icon click if playlist ther eask which playlist to add if not ask them to create new playlist store all playlist data song ids in firebase

each played song should be in history store in firebase

main workflow
1. manual selection 
    .gener
    .artist = itunes to search
    .mood
    .find songs clicked all 3 data along with profile top3 language preference feed to youtube api it will fetch song and video that will be displayed in recomendations page

2. mood detection
    .interface of hf
    .send blob image to hf mode
    .detect mood and send to backend
    .if not match mood coorectly retake button if coorect find songs button also there is back buttno as before 
    .once find song clicked detected mood along with top 3 language preference  fed to youtube api remaining work as it is 

3. quetionaries text based
    .answer quizes
    .based on solution detect mood 
    .if final find songs other wise retake as usual back cbutton also there
    .once find song clicked detected mood along with top 3 language preference  fed to youtube api remaining work as it is 

4. in recomendation page 
    .after fetrching grid is there to display somgs dynamic can be scrolable 
    .find more will fetch more songs
    .the songs will be appended below grid size increase accoedingly
    .audioplayer back to home and find more buttons are fixed below contianer
    . add to fsvorites , playlist hostory will work
    .stream button once clicked new page full screen video streaming
    .top right button back icon clicked will navigate back to recomendations page