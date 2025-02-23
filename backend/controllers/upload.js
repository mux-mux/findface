async function handleUpload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({ imageUrl: req.file.location });
}

export default handleUpload;
