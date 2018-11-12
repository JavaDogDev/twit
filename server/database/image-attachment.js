const mongoose = require('mongoose');

const Upload = require('./upload');

/**
 * An association of 4 images to serve as an attachment for a Twat.
 */
function createImageAttachmentModel() {
  const imageAttachmentSchema = mongoose.Schema({
    userId: { type: String, required: true, index: true },
    images: { type: [mongoose.Schema.Types.ObjectId], ref: 'Upload' },
  });

  /**
   * Deletes images uploaded for this ImageAttachement
   * as long as they're not used by other ImageAttachments
   */
  imageAttachmentSchema.methods.deleteAttachment = function deleteAttachment() {
    // Avoid trying to remove the same image more than once,
    // in case of duplicates within this ImageAttachment
    const imagesToPotentiallyDelete = [];
    this.images.forEach((imageId) => {
      if (!imagesToPotentiallyDelete.includes(imageId.toString())) {
        imagesToPotentiallyDelete.push(imageId.toString());
      }
    });

    Promise.all(imagesToPotentiallyDelete.map(async imageId => Upload.findOne({ _id: imageId })))
      .then(images => Promise.all(images.map(async (imageDoc) => {
        try {
          // Remove Upload DB record and file for this image if it's not used elsewhere
          const numUses = await this.constructor.countDocuments({ images: imageDoc._id }).exec();
          if (numUses > 1) {
            return Promise.resolve();
          }
          return imageDoc.remove();
        } catch (err) {
          return Promise.reject(err);
        }
      })))
      .then(() => this.remove())
      .catch(err => console.error(`Problem deleting ImageAttachment '${this._id}':${err}`));
  };

  return mongoose.model('ImageAttachment', imageAttachmentSchema);
}

const ImageAttachment = createImageAttachmentModel();

module.exports = ImageAttachment;
