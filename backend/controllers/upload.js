async function handleUpload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
  }
}

export default handleUpload;
