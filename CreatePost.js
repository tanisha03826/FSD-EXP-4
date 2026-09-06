import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreatePost.css";


function CreatePost() {

    const navigate = useNavigate();


    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [platform, setPlatform] = useState("Instagram");
    const [tags, setTags] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [media, setMedia] = useState(null);

    const handleSubmit = async (e) => {

        e.preventDefault();


        console.log("Create Post button clicked");
        if (!title.trim()) {

            alert("Please enter a post title");

            return;

        }


        if (!content.trim()) {

            alert("Please enter post content");

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

        const token =
            localStorage.getItem("token");


        if (!token) {

            alert(
                "Please login first"
            );

            navigate("/");

            return;

        }


        const formData = new FormData();


        formData.append(
            "title",
            title
        );


        formData.append(
            "content",
            content
        );


        formData.append(
            "platform",
            platform
        );


        formData.append(
            "tags",
            tags
        );


        // Add scheduled time only if selected

        if (scheduledTime) {

            formData.append(
                "scheduledTime",
                scheduledTime
            );

        }


        // Add media only if selected

        if (media) {

            formData.append(
                "media",
                media
            );

        }


        try {

            console.log(
                "Sending post to backend..."
            );


            const response = await axios.post(

                "http://localhost:5001/api/posts",

                formData,

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            console.log(
                "Server Response:",
                response.data
            );


            alert(
                response.data.message ||
                "Post Created Successfully"
            );


            // Clear form

            setTitle("");
            setContent("");
            setPlatform("Instagram");
            setTags("");
            setScheduledTime("");
            setMedia(null);

            navigate("/dashboard");


        }


        catch (error) {

            console.log(
                "Create Post Error:",
                error
            );


            console.log(
                "Server Error:",
                error.response?.data
            );


            alert(

                error.response?.data?.message ||

                "Post Creation Failed"

            );

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="create-container">


            <h1>
                Create New Post
            </h1>


            <form onSubmit={handleSubmit}>


                {/* ========================================= */}
                {/* TITLE */}
                {/* ========================================= */}

                <input

                    type="text"

                    placeholder="Post Title"

                    value={title}

                    onChange={(e) =>
                        setTitle(e.target.value)
                    }

                    required

                />


                {/* ========================================= */}
                {/* PLATFORM */}
                {/* ========================================= */}

                <select

                    value={platform}

                    onChange={(e) =>
                        setPlatform(e.target.value)
                    }

                >

                    <option value="Instagram">
                        Instagram
                    </option>

                    <option value="Twitter">
                        Twitter
                    </option>

                </select>


                {/* ========================================= */}
                {/* CONTENT */}
                {/* ========================================= */}

                <textarea

                    placeholder="Write your content"

                    value={content}

                    onChange={(e) =>
                        setContent(e.target.value)
                    }

                    required

                />


                <p>
                    Characters: {content.length}
                </p>


                {/* ========================================= */}
                {/* TAGS */}
                {/* ========================================= */}

                <input

                    type="text"

                    placeholder="Tags (comma separated)"

                    value={tags}

                    onChange={(e) =>
                        setTags(e.target.value)
                    }

                />


                {/* ========================================= */}
                {/* SCHEDULE */}
                {/* ========================================= */}

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


                {/* ========================================= */}
                {/* MEDIA */}
                {/* ========================================= */}

                <label>
                    Upload Media
                </label>


                <input

                    type="file"

                    accept="image/png,image/jpeg,image/jpg"

                    onChange={(e) =>
                        setMedia(
                            e.target.files[0]
                        )
                    }

                />


                {/* ========================================= */}
                {/* SUBMIT */}
                {/* ========================================= */}

                <button
                    type="submit"
                >

                    Create Post

                </button>


                {/* ========================================= */}
                {/* BACK TO DASHBOARD */}
                {/* ========================================= */}

                <button

                    type="button"

                    onClick={() =>
                        navigate("/dashboard")
                    }

                >

                    ← Back to Dashboard

                </button>


            </form>


        </div>

    );

}


export default CreatePost;
