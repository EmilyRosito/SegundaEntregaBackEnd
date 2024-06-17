import { Router } from "express";
import fs from "fs";

const router = Router();
let products = [];

const loadProducts = async () => {
  try {
    const data = await fs.promises.readFile("./info/productos.json", "utf-8");
    products = JSON.parse(data);
  } catch (error) {
    console.error("Error loading products:", error);
    products = []; 
  }
};

loadProducts().catch(err => console.error("Failed to load products:", err));

router.get("/", (req, res) => {
  res.render("home", { products });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { products });
});

export default router;
