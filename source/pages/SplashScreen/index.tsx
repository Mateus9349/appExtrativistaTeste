import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import splashScreen from "../../../assets/animationsJSON/splashScreenV2.json";

interface Props {
  onAnimationEnd: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AnimatedSplashScreen({ onAnimationEnd }: Props) {
  const lottieRef = useRef<LottieView>(null);

  const animationFinished = () => {
    console.log("Animação finalizada");
    onAnimationEnd(true);
  };

  useEffect(() => {
    lottieRef.current?.reset();

    setTimeout(() => {
      lottieRef.current?.play();
    }, 0);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LottieView
        ref={lottieRef}
        onAnimationFinish={animationFinished}
        speed={1}
        source={splashScreen}
        autoPlay={true}
        loop={false}
      />
    </View>
  );
}
