export default function handler(req, res) {
  if (req.method === 'POST') {
    // Simulate file upload processing
    setTimeout(() => {
      res.status(200).json({ message: 'File uploaded successfully' });
    }, 2000); // Simulate a delay for the upload process
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}