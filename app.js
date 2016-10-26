var Colors = require("colors");
var BlessContrib = require("blessed-contrib");
var BlessedScreen = require("blessed").screen();
var Mindwave = new require("mindwave")();

const GRAPH_MAX_DATA = 100;

/*
 * Meditation Graph
 */

const meditationLine = BlessContrib.line({
  width: 100,
  height: 14,
  left: 1,
  top: 1,
  label: "Meditation Graph",
  style: {
    line: "green",
    baseline: "white"
  }
});

const meditationData = {
  title: "Meditation",
  x: [],
  y: []
};

BlessedScreen.append(meditationLine);
meditationLine.setData(meditationData);

/*
 * Theta Graph
 */

const thetaLine = BlessContrib.line({
  width: 100,
  height: 14,
  left: 1,
  top: 13,
  label: "Theta Graph",
  style: {
    line: "green",
    baseline: "white"
  }
});

const thetaData = {
  title: "Theta",
  x: [],
  y: []
};

BlessedScreen.append(thetaLine);
thetaLine.setData(thetaData);

/*
 * Low Alpha Graph
 */

const lowAlphaLine = BlessContrib.line({
  width: 100,
  height: 14,
  left: 1,
  top: 25,
  label: "Low Alpha Graph",
  style: {
    line: "green",
    baseline: "white"
  }
});

const lowAlphaData = {
  title: "Low Alpha",
  x: [],
  y: []
};

BlessedScreen.append(lowAlphaLine);
lowAlphaLine.setData(lowAlphaData);

/*
 * Data log
 */

const dataLog = BlessContrib.log({
  width: 20,
  height: 100,
  left: 100,
  top: 1,
  fg: "green",
  selectedFg: "green",
  label: 'Server Log'
});

BlessedScreen.append(dataLog);

/*
 * Utils
 */
const setGraphData = function(graphInstance, graphData, data) {
  if (graphData.y.length > GRAPH_MAX_DATA &&
      graphData.x.length > GRAPH_MAX_DATA) {
    graphData.y.shift();
    graphData.x.shift();
  }
  graphData.y.push(data);
  graphData.x.push(graphData.x.length + 1);
  graphInstance.setData(graphData);
}

/*
 * Mindwave events
 */

Mindwave.on("meditation", function(data) {
  dataLog.log("Meditation: " + data);
  setGraphData(meditationLine, meditationData, data);
  BlessedScreen.render();
});

Mindwave.on("eeg", function(data) {
  thetaValue = (data["theta"] / 1000000);
  lowAlphaValue = (data["loAlpha"] / 1000000);

  dataLog.log("Theta: " + thetaValue);
  dataLog.log("Alpha: " + lowAlphaValue);

  setGraphData(lowAlphaLine, lowAlphaData, lowAlphaValue);
  setGraphData(thetaLine, thetaData, thetaValue);
  BlessedScreen.render();
});

Mindwave.on("connect", function(data) {
  dataLog.log("MindWave connect");
});

Mindwave.on("disconnect", function(data) {
  dataLog.log("MindWave disconnect");
});

Mindwave.on("error", function(data) {
  dataLog.log("error: " + data);
});

Mindwave.connect("/dev/cu.MindWaveMobile-DevA");

BlessedScreen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

BlessedScreen.render();
