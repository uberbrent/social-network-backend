const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validator: function(email) {
                return /^([a-z0-9_.-]+)@([/da-z.-]+).([a-z.]{2,6})$/.test(email);
              },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
);

UserSchema.virtual('friendCount').get(function() {
    return this.users.reduce((total, users) => total + users.replies.length + 1, 0);
});

const User = model('User', UserSchema);

module.exports = User