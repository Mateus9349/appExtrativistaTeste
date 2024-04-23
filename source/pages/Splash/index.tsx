import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { hideAsync } from "expo-splash-screen";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

interface Props {
  onComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Splash({ onComplete }: Props) {
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      hideAsync();
      if (status.didJustFinish) {
        onComplete(true);
      }
    }
  };

  return (
    <Video
      style={StyleSheet.absoluteFill}
      resizeMode={ResizeMode.COVER}
      source={require("../../../assets/videos/splash.mp4")}
      isLooping={false}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      shouldPlay={true}
    />
  );
}
