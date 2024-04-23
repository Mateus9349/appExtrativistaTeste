import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native'

interface Props {
    children: ReactNode
    gradientColor: 'green' | 'brown' | 'white'
    style?: ViewStyle
}

// colors={["#00491E", "#9CAF88"]}

export function Gradient({ children, gradientColor, style }: Props) {

    
    const handleColors = () => {
        switch(gradientColor){
            case 'green':
                return ["#00491E", "#5E865D"]
            case 'brown':
                return ["#653024", "#BE6A14"]
            case 'white':
                return ['#fff', "#fff"]
        }
    }
            
    var colors = handleColors()
    return (
        <LinearGradient
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0.1 }}
            style={[{ flex: 1 }, style]}
            colors={colors!}
        >
            {children}
        </LinearGradient>
    );
}