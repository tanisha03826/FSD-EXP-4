const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");

router.post(
    "/",
    verifyToken,
    upload.single("media"),
    async (req, res) => {

        try {

            const {
                title,
                content,
                platform,
                tags,
                scheduledTime
            } = req.body;

            let status = "Draft";

            if (scheduledTime) {

                const selectedDate = new Date(scheduledTime);

                const currentDate = new Date();

                if (isNaN(selectedDate.getTime())) {

                    return res.status(400).json({
                        message: "Invalid scheduled date"
                    });

                }


                if (selectedDate <= currentDate) {

                    return res.status(400).json({
                        message: "Scheduled time must be in the future"
                    });

                }


                status = "Scheduled";

            }

            const post = new Post({

                title: title,

                content: content,

                platform: platform,


                tags: tags
                    ? tags
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(tag => tag !== "")
                    : [],


                media: req.file
                    ? req.file.filename
                    : "",


                scheduledTime: scheduledTime
                    ? new Date(scheduledTime)
                    : null,


                status: status,


                author: req.user.id

            });


            await post.save();

            res.status(201).json({

                message:
                    status === "Scheduled"
                        ? "Post Scheduled Successfully"
                        : "Post Created Successfully",

                post

            });

        }


        catch (error) {

            console.log(
                "Create Post Error:",
                error
            );


            res.status(500).json({

                message: error.message

            });

        }

    }
);

router.get(
    "/",
    verifyToken,
    async (req, res) => {

        try {

            const posts = await Post.find()
                .populate(
                    "author",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json(posts);

        }

        catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


router.get(
    "/my-posts",
    verifyToken,
    async (req, res) => {

        try {

            const posts = await Post.find({

                author: req.user.id

            })
                .populate(
                    "author",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json(posts);

        }

        catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


router.get(
    "/scheduled",
    verifyToken,
    async (req, res) => {

        try {

            const posts = await Post.find({

                author: req.user.id,

                status: "Scheduled",

                scheduledTime: {
                    $ne: null
                }

            })
                .sort({
                    scheduledTime: 1
                });


            res.status(200).json(posts);

        }

        catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


router.get(
    "/:id",
    verifyToken,
    async (req, res) => {

        try {

            const post =
                await Post.findById(
                    req.params.id
                );


            if (!post) {

                return res.status(404).json({

                    message: "Post not found"

                });

            }


            // Only owner can view

            if (
                !post.author ||
                post.author.toString() !== req.user.id
            ) {

                return res.status(403).json({

                    message: "Not Allowed"

                });

            }


            res.status(200).json(post);

        }

        catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


router.put(
    "/:id",
    verifyToken,
    async (req, res) => {

        try {

            const post =
                await Post.findById(
                    req.params.id
                );


            if (!post) {

                return res.status(404).json({

                    message: "Post not found"

                });

            }


        
            if (!post.author) {

                return res.status(403).json({

                    message: "Post has no owner"

                });

            }


            if (
                post.author.toString() !==
                req.user.id
            ) {

                return res.status(403).json({

                    message: "Not Allowed"

                });

            }

            if (
                req.body.scheduledTime !== undefined
            ) {

                if (
                    req.body.scheduledTime &&
                    new Date(req.body.scheduledTime) <= new Date()
                ) {

                    return res.status(400).json({

                        message:
                            "Scheduled time must be in the future"

                    });

                }


                if (req.body.scheduledTime) {

                    req.body.scheduledTime =
                        new Date(
                            req.body.scheduledTime
                        );

                    req.body.status = "Scheduled";

                }

                else {

                    req.body.scheduledTime = null;

                    req.body.status = "Draft";

                }

            }

            const updatedPost =
                await Post.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            res.status(200).json({

                message: "Post Updated Successfully",

                post: updatedPost

            });

        }

        catch (error) {

            console.log(
                "Update Post Error:",
                error
            );


            res.status(500).json({

                message: error.message

            });

        }

    }
);

router.delete(
    "/:id",
    verifyToken,
    async (req, res) => {

        try {

            const post =
                await Post.findById(
                    req.params.id
                );


            if (!post) {

                return res.status(404).json({

                    message: "Post not found"

                });

            }

            if (!post.author) {

                return res.status(403).json({

                    message: "Post has no owner"

                });

            }


            if (
                post.author.toString() !==
                req.user.id
            ) {

                return res.status(403).json({

                    message: "Not Allowed"

                });

            }


            await Post.findByIdAndDelete(
                req.params.id
            );


            res.status(200).json({

                message:
                    "Post Deleted Successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


module.exports = router;
