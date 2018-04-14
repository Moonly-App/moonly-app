import {Posts} from "meteor/example-forum";
import Users from 'meteor/vulcan:users';
import {getComponent, getSetting} from 'meteor/vulcan:lib';
import {Utils} from 'meteor/vulcan:users';
import FormsUpload from 'meteor/vulcan:forms-upload';
const formGroups = {
  admin: {
    name: "admin",
    order: 2
  }
};

let postSchema = [
  {
    fieldName: 'image',
    fieldSchema: {
      type: String,
      optional: true,
      control: FormsUpload,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      form: {
        options: {
          preset: getSetting('cloudinary').upload_preset
        }
      }
    }
  }, {
  fieldName: 'sticky',
  fieldSchema: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    control: "checkbox",
    group: formGroups.admin
    }
  }
]

Posts.addField(postSchema);
export default postSchema;
