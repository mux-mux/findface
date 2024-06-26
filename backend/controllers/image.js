const handleImage = (req, res, db) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entriesArray) => res.json(entriesArray[0].entries))
    .catch(() => res.status(400).json('Unable to get tries count'));
};

export default handleImage;
