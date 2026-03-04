"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Backdrop,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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

const FilterableTable = ({ sizes = [], fetchSizes }) => {
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSize, setCurrentSize] = useState({ id: null, name: "" });

  useEffect(() => {
    setFilteredData(
      (sizes || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, sizes]);

  const handleAddOrUpdateSize = async () => {
    if (!currentSize.name.trim()) {
      alert("Size name cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      const method = currentSize.id ? "PUT" : "POST";
      const response = await fetch("/api/sizes", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentSize),
      });

      if (response.ok) {
        fetchSizes();
        setIsModalOpen(false);
        setCurrentSize({ id: null, name: "" });
      } else {
        const result = await response.json();
        alert(`Failed to save size: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving size:", error);
      alert(`Error saving size: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditClick = (size) => {
    setCurrentSize(size);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this size?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/sizes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchSizes();
      } else {
        console.error("Failed to delete size");
      }
    } catch (error) {
      console.error("Error deleting size:", error);
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{ p: 1, bgcolor: "grey.100", minHeight: "100vh" }}>
      {/* Loading Overlay */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: "column", backdropFilter: "blur(6px)" }}
        open={isLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "rgba(255, 255, 255, 0.1)", p: 3, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <ModernProgress />
          <AnimatedLabel sx={{ mt: 2 }}>Loading</AnimatedLabel>
        </Box>
      </Backdrop>

      {/* Main Content */}
      <Paper square sx={{ p: 2, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "medium", color: "grey.800" }}>
            Sizes List
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="toggle search"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => {
                setCurrentSize({ id: null, name: "" });
                setIsModalOpen(true);
              }}
              aria-label="add new size"
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Search Field */}
        {isSearchVisible && (
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "grey.500" }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: "medium", color: "grey.500" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "grey.500" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "grey.500" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontWeight: "medium", color: "grey.900" }}>{item.id}</TableCell>
                    <TableCell sx={{ color: "grey.500" }}>{item.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(item)}
                          aria-label="edit size"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(item.id)}
                          aria-label="delete size"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" color="grey.500">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Size Dialog */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ square: true }}>
        <DialogTitle>
          <Typography variant="h6">
            {currentSize.id ? "Edit Size" : "Add New Size"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Size Name"
              value={currentSize.name}
              onChange={(e) => setCurrentSize({ ...currentSize, name: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsModalOpen(false)}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdateSize}
            color="primary"
            variant="contained"
          >
            {currentSize.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilterableTable;