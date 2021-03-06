import express from "express";
import itemModel from "../models/createItem.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/item", async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);
    res.status(200).send(item);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.put(
  "/item",
  [body("id").trim().isLength({ min: 1 }).withMessage("Introduza um id")],
  validateRequest,
  // currentUser,
  // requiredAuth,
  async (req, res) => {
    try {
      const { name, id, confetionTime } = req.body;
      // const { currentUser } = req;
      // const user = await userModel.findById(currentUser.id);
      // if (!user) {
      //   return res.status(400).send("Utilizador não encontrado");
      // }
      // if (user.permission !== "admin") {
      //   return res.status(400).send("Não tem permissão para fazer isto");
      // }
      const item = await itemModel.findById(id);
      if (!item) {
        return res.status(400).send("Tipo de produto não encontrado");
      }
      item.set({
        name: name || item.name,
        confetionTime: confetionTime || item.confectionTime,
      });
      await item.save();

      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo de errado aconteceu: ${error}`);
    }
  }
);

router.post(
  "/item",
  [
    body("confetionTime")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Introduza um tempo de confecção"),

    body("name").trim().isLength({ min: 1 }).withMessage("Introduza um nome"),
  ],
  validateRequest,
  // currentUser,
  // requiredAuth,
  async (req, res) => {
    try {
      const { name, confetionTime } = req.body;
      // const { currentUser } = req;
      // const user = await userModel.findById(currentUser.id);
      // if (!user) {
      //   return res.status(400).send("Utilizador não encontrado");
      // }
      // if (user.permission !== "admin") {
      //   return res.status(400).send("Não tem permissão para fazer isto");
      // }

      const itemType = new itemModel({
        name: name,
        confetionTime: confetionTime,
      });
      await itemType.save();

      res.status(200).json("Adicionado com sucesso");
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.delete(
  "/item",
  [body("id").trim().isLength({ min: 1 }).withMessage("Provide a id")],
  // validateRequest,
  // requiredAuth,
  async (req, res) => {
    try {
      const { id } = req.body;

      // const user = await userModel.findById(req.currentUser.id);
      // if (!user) {
      //   return res.status(400).send("User not found");
      // }
      // if (user.permission === "view") {
      //   return res.status(400).send("You are not authorized to do this");
      // }
      const item = await itemModel.findById(id);
      console.log(item);
      if (!item) {
        return res.status(400).send("Product not found");
      }

      await item.remove();
      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

export { router as itemRouter };
