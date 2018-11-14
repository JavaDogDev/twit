const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const readChunk = require('read-chunk');
const imageType = require('image-type');

const Twat = require('../database/twat');
const Upload = require('../database/upload');
const ImageAttachment = require('../database/image-attachment');

const uploadRouter = express.Router();

const ALLOWED_IMAGE_FORMATS = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
const imageUpload = multer({
  dest: path.join(process.cwd(), '/uploads/images/'),
  limits: { fileSize: 2097152 },
}).array('images', 4);

const sha1 = filePath => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha1');
  const rs = fs.createReadStream(filePath);
  rs.on('error', reject);
  rs.on('data', chunk => hash.update(chunk));
  rs.on('end', () => resolve(hash.digest('hex')));
});

uploadRouter.get('/image-attachment/:id', async (req, res) => {
  let attachment;
  try {
    attachment = await ImageAttachment.findById(req.params.id).exec();
    if (attachment === null) {
      return res.status(404).end();
    }
  } catch (err) {
    console.error(`Error while getting data for ImageAttachment '${req.params.id}':\n\t${err}'`);
    return res.status(500).end();
  }

  const imageUrls = await Promise.all(attachment.images.map(uploadId => Upload.findById(uploadId).exec()))
    .then(uploads => uploads.map(upload => `/uploads/images/${upload.fileName}`))
    .catch((err) => {
      console.error(`Error getting Upload fileNames:\n\t${err}`);
      return res.status(500).end();
    });

  return res.json(imageUrls);
});

/**
 * Deletes multiple files.
 * @param {Array<String>} paths to the files
 */
function deleteFiles(paths) {
  Promise.all(paths.map(p => util.promisify(fs.unlink)(p)))
    .catch(err => console.error(`Couldn't delete files:\n\t${paths.join('\n\t')}\n${err}`));
}

/**
 * Deletes an ImageAttachment from the DB, along with
 * all images it uses (as long as they're not used elsewhere)
 */
async function deleteImageAttachment(attachmentId, currentUserId) {
  // TODO: only allow delete if ImageAttachment isn't used by a Twat
  const attachment = await ImageAttachment.findOne({ _id: attachmentId }).exec();
  if (!attachment) {
    throw new Error(`An ImageAttachment with ID '${attachmentId}' does not exist.`);
  }

  // Ensure current user owns this ImageAttachment
  if (attachment.userId !== currentUserId) {
    return Promise.reject(
      new Error(`User ${currentUserId} is not allowed to delete ImageAttachment '${attachmentId}'`));
  }

  if (await Twat.countDocuments({ images: attachmentId }).exec() > 0) {
    return Promise.reject(
      new Error(`Can't delete ImageAttachment '${attachmentId}' as it's referenced by a Twat`));
  }

  return attachment.deleteAttachment();
}

uploadRouter.delete('/image-attachment/:id', async (req, res) => {
  deleteImageAttachment(req.params.id, req.session.userId)
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(`Couldn't delete ImageAttachment '${req.params.id}':\n\t${err}`);
      return res.status(500).end();
    });
});

/**
 * Accepts image uploads
 * (you can only upload four images at a time, no more no less)
 *
 * TODO: occasionally scan DB for stray images not attached to any Twat and remove them
 */
uploadRouter.post('/four-images', (req, res) => {
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
    return Promise.all(req.files.map((file, index) => {
      const newFilename = `${imageHashes[index]}.${fileTypes[index].ext}`;
      const newPath = path.join(file.destination, newFilename);

      // Don't try to rename into a file that already exists
      if (fs.existsSync(newPath)) {
        deleteFiles([file.path]);
      } else {
        fs.renameSync(file.path, newPath);
      }

      return newFilename;
    }))
      .then(fileNames => (
        Promise.all(fileNames.map(fileName => (
          new Promise(async (resolve, reject) => {
            try {
              const options = { upsert: true, new: true, setDefaultsOnInsert: true };
              const uploadRecord = await Upload.findOneAndUpdate({ type: 'IMAGE', fileName }, {}, options).exec();
              return resolve(uploadRecord._id);
            } catch (e) {
              // Ignore duplicate key errors because we can throw out the new doc in this case
              // (findOneAndUpdate isn't atomic so this problem is unavoidable)
              if (e.code === 11000) {
                const existingDoc = await Upload.findOne({ type: 'IMAGE', fileName }).exec();
                return resolve(existingDoc._id);
              }

              console.error(`Couldn't create DB Upload records for files: ${fileNames}\n\t${e}`);
              return reject(e);
            }
          })
        )))
      ))
      .then(async (uploadIDs) => {
        const imageAttachment = await new ImageAttachment({ userId: req.session.userId, images: uploadIDs }).save();
        return res.json({ imageAttachment: imageAttachment._id });
      })
      .catch((e) => {
        console.error(`Error while uploading images:\n\t${e}`);
        deleteTempUploads();
        return res.status(500).end();
      });
  });
});

module.exports = { deleteImageAttachment, uploadRouter };
