import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CreatePost.css";


function EditPost() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [platform, setPlatform] = useState("Instagram");
    const [tags, setTags] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");


    // =====================================================
    // FETCH POST
    // =====================================================

    useEffect(() => {

        fetchPost();

    }, [id]);


    const fetchPost = async () => {

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert("Please login first");

                navigate("/");

                return;

            }


            const response = await axios.get(

                `http://localhost:5001/api/posts/${id}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            const post = response.data;


            console.log(
                "Post received:",
                post
            );


            setTitle(
                post.title || ""
            );


            setContent(
                post.content || ""
            );


            setPlatform(
                post.platform || "Instagram"
            );


            setTags(
                post.tags
                    ? post.tags.join(", ")
                    : ""
            );


            if (post.scheduledTime) {

                const date =
                    new Date(post.scheduledTime);


                // Convert to datetime-local format

                const localDate =
                    new Date(
                        date.getTime() -
                        date.getTimezoneOffset() * 60000
                    )
                    .toISOString()
                    .slice(0, 16);


                setScheduledTime(
                    localDate
                );

            }

            else {

                setScheduledTime("");

            }

        }

        catch (error) {

            console.log(
                "Fetch Post Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to load post"
            );

        }

    };


    // =====================================================
    // UPDATE POST
    // =====================================================

    const handleUpdate = async (e) => {

        e.preventDefault();


        // Validation

        if (!title.trim()) {

            alert(
                "Please enter a post title"
            );

            return;

        }


        if (!content.trim()) {

            alert(
                "Please enter post content"
            );

            return;

        }


        // Twitter validation

        if (
            platform === "Twitter" &&
            content.length > 280
        ) {

            alert(
                "Twitter allows maximum 280 characters"
            );

            return;

        }


        // Instagram validation

        if (
            platform === "Instagram" &&
            content.length > 2200
        ) {

            alert(
                "Instagram allows maximum 2200 characters"
            );

            return;

        }


        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert(
                    "Please login first"
                );

                navigate("/");

                return;

            }


            const updatedData = {

                title: title,

                content: content,

                platform: platform,

                tags: tags
                    ? tags
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(tag => tag !== "")
                    : [],

                scheduledTime:
                    scheduledTime
                        ? scheduledTime
                        : null

            };


            console.log(
                "Updating post:",
                updatedData
            );


            const response =
                await axios.put(

                    `http://localhost:5001/api/posts/${id}`,

                    updatedData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            console.log(
                "Update Response:",
                response.data
            );


            alert(
                response.data.message ||
                "Post Updated Successfully"
            );


            // Go back to post listing

            navigate("/posts");

        }

        catch (error) {

            console.log(
                "Update Post Error:",
                error
            );


            console.log(
                "Server Response:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Post Update Failed"
            );

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="create-container">


            <h1>
                Edit Post
            </h1>


            <form onSubmit={handleUpdate}>


                {/* TITLE */}

                <input

                    type="text"

                    placeholder="Post Title"

                    value={title}

                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }

                    required

                />


                {/* PLATFORM */}

                <select

                    value={platform}

                    onChange={(e) =>
                        setPlatform(
                            e.target.value
                        )
                    }

                >

                    <option value="Instagram">
                        Instagram
                    </option>

                    <option value="Twitter">
                        Twitter
                    </option>

                </select>


                {/* CONTENT */}

                <textarea

                    placeholder="Write your content"

                    value={content}

                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }

                    required

                />


                <p>
                    Characters: {content.length}
                </p>


                {/* TAGS */}

                <input

                    type="text"

                    placeholder="Tags (comma separated)"

                    value={tags}

                    onChange={(e) =>
                        setTags(
                            e.target.value
                        )
                    }

                />


                {/* SCHEDULE */}

                <label>
                    Schedule Post
                </label>


                <input

                    type="datetime-local"

                    value={scheduledTime}

                    onChange={(e) =>
                        setScheduledTime(
                            e.target.value
                        )
                    }

                />


                {/* BUTTON */}

                <button type="submit">

                    Update Post

                </button>


                <button

                    type="button"

                    onClick={() =>
                        navigate("/posts")
                    }

                >

                    Cancel

                </button>


            </form>

        </div>

    );

}


export default EditPost;
