const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    //Query for all
    const tagData = await Tag.findAll({
      include: [{ model: Product}],
    });
    res.status(200).json(tagData);
    console.log('Tag data recieved!')
  } catch (err) {
    res.status(500).json(err);
  };
});


router.get('/:id', async (req, res) => {
  try {
    //Get param id
    const tagData = await Tag.findByPk(req.params.id, {
      include:  [{ model: Product}],
    });
    res.status(200).json(tagData);
    console.log(`${tagData.tag_name}' recieved!`)

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  //Create tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
    console.log('Tag created!');
  } catch (err) {
    res.status(500).json(err);
  };
});

router.put('/:id', async (req, res) => {
  try {
    //Update tag
    const updatedTag = await Tag.update(
      req.body,
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).json(updatedTag);
    console.log(`Tag ${req.params.id} updated!`)
  } catch (err) {
    res.status(500).json(err);
  };
});

router.delete('/:id', async (req, res) => {
  //delete tag
  try {
    const deletedTag = await Tag.destroy(
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).json(deletedTag);
    console.log(`Tag ${req.params.id} deleted!`)
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
