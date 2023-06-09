## Starting the app

Create an API in the google developers console [https://console.developers.google.com](https://console.developers.google.com), make sure to enable billing for the google project, otherwise you may get a warning as _development purposes only_.

Add a `.env` file or `.env.local` in the project root and specify your API key as `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`

In the project directory, you can run:

```
yarn install
yarn start
```

OR using npm

```
npm install
npm start
```
# Test case format
1. Start with the number of nodes (N).
2. Specify latitude, longitude, and names for the N nodes. THIS CANNOT BE DUPLICATE!!!!!!!!!!!
3. Specify the weight matrix for the graph. It can be undirected/directed.
4. For non-bonus, we will use the weight matrix values directly. For bonus, we will calculate weight based on latitude ang longitude. You can specify weight for bonus, but it will not be used. // Source: https://community.powerbi.com/t5/Desktop/How-to-calculate-lat-long-distance/td-p/1488227
5. To get weighted result of a non weighted set of coordinate nodes, you can load the file into bonus first, and later use the download button to get back the distance matrix.
8
-6.920798126505993 107.60440580899946 A
-6.920177278581428 107.59848010181967 B
-6.923136646377968 107.59871984019819 C
-6.923602279475666 107.60369701724527 D
-6.9220656884978515 107.60390027372263 E
-6.926670272811521 107.60004882459582 F
-6.929146719627909 107.60064580583646 G
-6.927203004185735 107.60339775232299 H
0 1 0 0 1 0 0 0
1 0 1 0 0 0 0 0
0 1 0 1 0 1 0 0
0 0 1 0 1 0 0 0
1 0 0 1 0 0 0 0 
0 0 1 0 0 0 1 1
0 0 0 0 0 1 0 0
0 0 0 0 0 1 0 0

# How to use
1. Enter the file that you want.
2. Enter source and dest node.
3. Toggle the search you want (A* or UCS)
4. Search.

You can also draw on map. Clicking on the map will place a marker. Click between 2 markers to draw a route. This will create a DIRECTED edge between the two nodes. To create an undirected edge, simply create a DIRECTED edge back. Happy charting!

Another note, you can download your created map into text config that you can load later :D.
## Author
William Nixon
Farhan Nabil Suryono


