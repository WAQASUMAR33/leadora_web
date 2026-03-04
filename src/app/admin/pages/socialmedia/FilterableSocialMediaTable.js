"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/system";

const ModernProgress = styled(Box)(({ theme }) => ({
  width: "300px",
  height: "8px",
  background: "rgba(255, 255, 255, 0.15)",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, #F25C2C, #F97316, #FB923C, #FBBF24, #F25C2C)",
    backgroundSize: "200% 100%",
    animation: "flow 1.5s infinite ease-in-out",
  },
  "@keyframes flow": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
}));

const AnimatedLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#FFFFFF",
  background: "linear-gradient(45deg, #F25C2C, #FB923C)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
  "&:after": {
    content: '"..."',
    display: "inline-block",
    animation: "dots 1.5s infinite steps(4, end)",
  },
  "@keyframes dots": {
    "0%": { content: '"."', opacity: 1 },
    "25%": { content: '".."', opacity: 1 },
    "50%": { content: '"..."', opacity: 1 },
    "75%": { content: '"..."', opacity: 0.5 },
    "100%": { content: '"..."', opacity: 1 },
  },
}));

const SocialMediaForm = () => {
  const [formData, setFormData] = useState({
    id: null,
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    pinterest: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch social media links on mount
  useEffect(() => {
    const fetchSocialMediaLinks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/socialmedia");
        const result = await response.json();
        if (result.status && result.data.length > 0) {
          const existingData = result.data[0];
          setFormData({
            id: existingData.id,
            facebook: existingData.facebook || "",
            instagram: existingData.instagram || "",
            twitter: existingData.twitter || "",
            tiktok: existingData.tiktok || "",
            pinterest: existingData.pinterest || "",
          });
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialMediaLinks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/socialmedia", {
        method: "POST", // Using POST to handle both create and update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status) {
        alert("Social media links updated successfully!");
      } else {
        alert("Failed to update social media links.");
      }
    } catch (error) {
      console.error("Error updating social media links:", error);
      alert("An error occurred while updating the data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 480, mx: "auto" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: "column", backdropFilter: "blur(6px)" }}
        open={isLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "rgba(255, 255, 255, 0.1)", p: 3, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Loading</AnimatedLabel>
        </Box>
      </Backdrop>
      <Paper square elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "grey.800", mb: 3 }}
        >
          Social Media Links
        </Typography>
        <Box
          component="form"
          onSubmit={handleUpdate}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {["facebook", "instagram", "twitter", "tiktok", "pinterest"].map((platform) => (
            <TextField
              key={platform}
              label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
              name={platform}
              value={formData[platform]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="url"
              disabled={isLoading}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Updating...
              </>
            ) : (
              "Update Links"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SocialMediaForm;