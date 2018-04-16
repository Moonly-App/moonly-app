

# Image uploading


## Dealing with Cloudinary
Make sure you have your Cloudinary upload "preset" name, because if you don't have this set up, you can not upload images. To get a "preset" name, please follow instructions below:

The upload to Cloudinary relies on **unsigned upload**:

> Unsigned upload is an option for performing upload directly from a browser or mobile application with no authentication signature, and without going through your servers at all. However, for security reasons, not all upload parameters can be specified directly when performing unsigned upload calls.

Unsigned upload options are controlled by [an upload preset](http://cloudinary.com/documentation/upload_images#upload_presets), so in order to use this feature you first need to enable unsigned uploading for your Cloudinary account from the [Upload Settings](https://cloudinary.com/console/settings/upload) page.

When creating your **preset**, you can define image transformations. I recommend to set something like 200px width & height, fill mode and auto quality. Once created, you will get a preset id.

It may look like this:

![Screenshot-Cloudinary](https://res.cloudinary.com/xavcz/image/upload/v1471534183/Capture_d_e%CC%81cran_2016-08-18_17.07.52_tr9uoh.png (27kB))

## Adding data to settings.json
Make sure to add the following to the `public` key of `settings.json`,
Then modify the cloudName and upload_preset to your account details.

```
"cloudinary": {
  "cloudName": "123456",
  "upload_preset": "123456"
}
```
