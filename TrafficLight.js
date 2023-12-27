// TrafficLight.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Draggable from 'react-native-draggable';
import axios from "axios";

const TrafficLight = ({ id, onClose }) => {
  const [currentLight, setCurrentLight] = useState(null);

  const lightColors = {
    red: "red",
    orange: "orange",
    green: "green",
  };

  const [red, setRed] = useState(lightColors.red);
  const [orange, setOrange] = useState(lightColors.orange);
  const [green, setGreen] = useState(lightColors.green);

  const setColorsBasedOnLight = useCallback((newCurrentLight) => {
    switch (newCurrentLight) {
      case "red":
        setRed("red r-color");
        setOrange(lightColors.orange);
        setGreen(lightColors.green);
        setCurrentLight("red");
        break;
      case "orange":
        setOrange("orange y-color");
        setGreen(lightColors.green);
        setRed(lightColors.red);
        setCurrentLight("orange");
        break;
      case "green":
        setGreen("green g-color");
        setRed(lightColors.red);
        setOrange(lightColors.orange);
        setCurrentLight("green");
        break;
      default:
        setRed(lightColors.red);
        setOrange(lightColors.orange);
        setGreen(lightColors.green);
        setCurrentLight(null);
    }
  }, [lightColors.red, lightColors.orange, lightColors.green]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.43.135:5000/traffic/${id}`);
      const newCurrentLight = response.data.color;
      if (newCurrentLight !== undefined) {
        setCurrentLight(newCurrentLight);
        setColorsBasedOnLight(newCurrentLight);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching current light data:", error.message);
    }
  };

  const handleColorChange = async (color) => {
    try {
      await axios.post(`http://192.168.43.135:5000/api/change-sequence-${color}`);
    } catch (error) {
      console.error("Error changing sequence:", error.message);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 500);

    return () => clearInterval(intervalId);
  }, [setColorsBasedOnLight]);

  return (
    <Draggable x={-7} y={-30}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <View style={[styles.square, { backgroundColor: red }]} onTouchEnd={() => handleColorChange("red")}></View>
        <View style={[styles.square, { backgroundColor: orange }]} onTouchEnd={() => handleColorChange("orange")}></View>
        <View style={[styles.square, { backgroundColor: green }]} onTouchEnd={() => handleColorChange("green")}></View>
        {currentLight !== null ? (
          <Text style={styles.lightText}>Current Light: {currentLight}</Text>
        ) : (
          <Text>Waiting.....</Text>
        )}
      </View>
    </Draggable>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: '-30%',
    left: '-7%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 3, 
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#555",
    borderRadius: 100,
    marginTop: 10,
  },
  lightText: {
    marginTop: 10,
  },
});

export default TrafficLight;
