const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const readChunk = require('read-chunk');
const imageType = require('image-type');

const fileUploadRouter = express.Router();

const ALLOWED_IMAGE_FORMATS = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
const imageUpload = multer({
  dest: path.join(process.cwd(), '/uploads/images/'),
  limits: { fileSize: 2097152 },
}).array('images', 4);

const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);

const sha1 = filePath => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha1');
  const rs = fs.createReadStream(filePath);
  rs.on('error', reject);
  rs.on('data', chunk => hash.update(chunk));
  rs.on('end', () => resolve(hash.digest('hex')));
});

/**
 * Deletes multiple files.
 * @param {Array<String>} paths to the files
 */
function deleteFiles(paths) {
  Promise.all(paths.map(p => unlink(p)))
    .catch(err => console.error(`Couldn't delete files:\n\t${paths.join('\n\t')}\n${err}`));
}

/**
 * Accepts image uploads
 * (you can only upload four images at a time, no more no less)
 */
fileUploadRouter.post('/four-images', (req, res) => {
  // Accept image upload...
  imageUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.error(`User '${req.session.userId}' attempted to upload more than 4 images at a time.`);
      // multer takes care of deletion in this case
      return res.status(400).end('You need to upload exactly 4 images; no more, no less.');
    }
    if (err) {
      console.error(`Error occured while uploading 4 images:\n\t${err}`);
      return res.status(500).end();
    }
    if (req.files.length < 4) {
      deleteFiles(req.files.map(f => f.path));
      return res.status(400).end('You need to upload exactly 4 images; no more, no less.');
    }

    // Quick call to delete temporary uploaded files on fail conditiion
    const deleteTempUploads = deleteFiles.bind(this, req.files.map(f => f.path));

    // Determine whether file is allowed based on contents
    // imageType supports jpg, png, gif, webp, tif, bmp, jxr, psd
    const fileTypes = req.files.map(file => imageType(readChunk.sync(file.path, 0, 12)));
    if (!fileTypes.every(type => type && ALLOWED_IMAGE_FORMATS.includes(type.ext))) {
      console.error(`User '${req.session.userId}' tried to upload a non-image file.`);
      deleteTempUploads();
      return res.status(400).end();
    }

    // We can safely rename the images and save them permanently
    let imageHashes;
    try {
      imageHashes = await Promise.all(req.files.map(f => f.path).map(async filePath => sha1(filePath)));
    } catch (e) {
      console.error(`Couldn't hash uploaded image:\n\t${e}`);
      deleteTempUploads();
      return res.status(500).end();
    }

    // Rename each temp file to [hash].[appropriateExtension]
    // Existing files will be overwritten
    Promise.all(req.files.map((file, index) => {
      const newPath = path.join(file.destination, `${imageHashes[index]}.${fileTypes[index].ext}`);
      rename(file.path, newPath);
      return newPath;
    }))
      .then(imagePaths => res.json({ imagePaths }))
      .catch((e) => {
        console.error(`Couldn't rename temporary uploaded image:\n\t${e}`);
        deleteTempUploads();
        return res.status(500).end();
      });
  });
});

module.exports = fileUploadRouter;
