const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // find all categories and associated products
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
    console.log('Category data received!')
  } catch (err) {
    res.status(500).json(err);
  };
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
    console.log(`${categoryData.category_name}' recieved!`)

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(newCategory);
    console.log('New category has been created!');
  } catch (err) {
    res.status(500).json(err);
  };
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).send(`${req.params.id} updated!`);
    res.json(updatedCategory)
    console.log(`${req.params.id} updated!`)
  } catch (err) {
    res.status(500).json(err);
  };});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy(
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).send(`${req.params.id} has been deleted!`);
    res.json(deletedCategory)
    console.log(`${req.params.id} has been deleted!`)
  } catch (err) {
    res.status(500).json(err);
  };});

module.exports = router;
