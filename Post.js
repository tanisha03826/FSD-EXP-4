const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        platform: {
            type: String,
            required: true
        },

        media: {
            type: String
        },

        tags: [
            {
                type: String
            }
        ],

        // Date and time at which the post is scheduled
        scheduledTime: {
            type: Date,
            default: null
        },

        // Post status
        status: {
            type: String,
            enum: ["Draft", "Scheduled", "Published"],
            default: "Draft"
        },

        // User who created the post
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);
