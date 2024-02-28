const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  //GET all products
  try {
    const productData = await Product.findAll({
      include: [{ model: Category},{ model: Tag}],
    });
    res.status(200).json(productData);
    console.log('Product data has been recieved')
  } catch (err) {
    res.status(500).json(err);
  };
});

// GET one product
router.get('/:id', async (req, res) => {
  //Find a specific product with id
  try {
    const productData = await Product.findByPk(req.params.id, {
      include:  [{ model: Category},{ model: Tag}],
    });
    res.status(200).json(productData);
    console.log(`Category data for '${productData.product_name}' has been recieved`);

  } catch (err) {
    res.status(500).json(err);
  };
});

// POST new product
router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      //If no product tag, create to via product model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      //Send json response of product
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  //Update/PUT product
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        //Find all
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
          const productTagsToRemove = productTags
            //filter
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      //Json response with product
      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    //Delete product
    const deletedProduct = await Product.destroy(
      {
        where: {
          id: req.params.id,
        },
      });
    //Send json response
    res.status(200).json(deletedProduct);
    console.log(`{Category} ${req.params.id} deleted`)
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
