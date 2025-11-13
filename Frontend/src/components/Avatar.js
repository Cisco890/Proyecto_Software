import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";

export default function Avatar({
  uri,
  name = "User",
  size = 50,
  style
}) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getFallbackUri = () => {
    const initials = getInitials(name);
    const backgroundColor = generateColorFromName(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size * 2}&background=${backgroundColor}&color=fff&bold=true`;
  };

  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash).toString(16).substring(0, 6);
    return color.padEnd(6, '0');
  };

  const imageSource = uri && !imageError
    ? { uri }
    : { uri: getFallbackUri() };

  return (
    <Image
      source={imageSource}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style
      ]}
      onError={() => setImageError(true)}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#ccc",
  },
});
