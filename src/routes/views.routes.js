import { Router } from "express";
import fs from "fs";

const router = Router();
let productos = [];

const loadProductos = async () => {
  try {
    const info = await fs.promises.readFile("./info/productos.json", "utf-8");
    productos = JSON.parse(info);
  } catch (error) {
    console.error("Error loading products:", error);
    productos = []; 
  }
};

loadProductos().catch(err => console.error("Failed to load products:", err));

router.get("/", (req, res) => {
  res.render("home", { productos });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { productos });
});

export default router;
