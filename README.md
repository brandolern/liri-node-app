# LIRI-node-app
LIRI is a _Language_ Interpretation and Recognition Interface. It is a command line node app that takes in parameters and gives you back data.

## Functionality
LIRI can take in 4 different commands and will log the corresponding data to the console.

1. concert-this: Enter a musician/band and a list of all of the upcoming concert dates/locations from the Bands In Town API will be logged to the console.

    Demo: https://youtu.be/9WTCeMZSdY4

2. spotify-this-song: Enter the name of a song and 20 songs will be returned to the console involving the value that was entered. It also outputs the
   year the song came out, album it's from, as well as a preview of the song if one is available.

    Demo: https://youtu.be/XCCLNsfGwTI

3. movie-this: Enter the name of a movie and the name, release years, ratings, plot, and actors are all logged to the console.

Demo: https://youtu.be/-pxl8ljrT-Y

4. do-what-it-says: This command will grab the text written in the random.txt file and run one of the three other commands for whatever the value on
   random.txt is.

   Demo: https://youtu.be/9WTCeMZSdY4

## Tips
Be aware that any search values that have an apostrophe in them need to be surrounded by quotes or the program will not run properly. 
Ex: "I don't know"
